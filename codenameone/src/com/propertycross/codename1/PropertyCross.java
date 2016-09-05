package com.propertycross.codename1;

import com.codename1.components.InfiniteProgress;
import com.codename1.components.InfiniteScrollAdapter;
import com.codename1.components.MultiButton;
import com.codename1.components.SpanLabel;
import com.codename1.io.ConnectionRequest;
import com.codename1.io.JSONParser;
import com.codename1.io.NetworkManager;
import com.codename1.io.Storage;
import com.codename1.location.Location;
import com.codename1.location.LocationManager;
import com.codename1.ui.Button;
import com.codename1.ui.Command;
import com.codename1.ui.Component;
import com.codename1.ui.ComponentGroup;
import com.codename1.ui.Container;
import com.codename1.ui.Dialog;
import com.codename1.ui.Display;
import com.codename1.ui.EncodedImage;
import com.codename1.ui.FontImage;
import com.codename1.ui.Form;
import com.codename1.ui.Image;
import com.codename1.ui.Label;
import com.codename1.ui.TextArea;
import com.codename1.ui.TextField;
import com.codename1.ui.Toolbar;
import com.codename1.ui.URLImage;
import com.codename1.ui.events.ActionEvent;
import com.codename1.ui.events.ActionListener;
import com.codename1.ui.layouts.BorderLayout;
import com.codename1.ui.layouts.BoxLayout;
import com.codename1.ui.list.DefaultListModel;
import com.codename1.ui.list.MultiList;
import com.codename1.ui.plaf.UIManager;
import com.codename1.ui.util.Resources;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The main and only class of the application, this was done in this way mostly for simplicity as this is a demo
 * and not a "real" application.
 * Several things to notice in this application:<br/>
 * 1. I used the native theme which was simpler but not necessarily attractive or common. Most developers customize the look of the app.
 * 2. I used the simpler JSON parser which I personally find more convenient. We have a binding JSON parser that binds Java objects 
 * to JSON as well as some more elaborate parsers.<br/>
 * 3. I used infinite scrolling instead of adding a more button, I could have done the whole "more" button but since inifinite scrolling is
 * builtin and more elegant I chose to go that way.<br/>
 * 
 * @author Shai Almog
 */
public class PropertyCross {
    /**
     * Determines the way the back command will behave across platforms
     */
    private static final Toolbar.BackCommandPolicy BACK_POLICY = Toolbar.BackCommandPolicy.AS_ARROW;
    
    /**
     * Caches results from searches, Codename One also contains a persistent CacheMap class that might be more suitable for caching since 
     * it also clears old cache entries and persists the caches to storage
     */
    private final Map<String, Map<Integer, Map<String, Object>>> cachedSearches = new HashMap<>();
    private final Map<Location, Map<Integer, Map<String, Object>>> cachedLocationSearches = new HashMap<>();
    private Form current;
    
    /**
     * Placeholder image that we show when fetching the actual image from the network, we load this from the resource file. It is a multi
     * image that adapts to device resolution.
     */
    private EncodedImage placeholder;

    /**
     * Placeholder image that we show when fetching the actual image from the network, we create this image dynamically based on screen size
     */
    private EncodedImage largePlaceholder;
    
    /**
     * A star image used to mark whether an entry is a favorite 
     */
    private Image favoriteUnsel;
    private Image favoriteSel;

    /**
     * The list of favorites for the user, this list is persisted and loaded 
     */
    private List<Map<String, Object>> favoritesList;

    /**
     * The list of recent searches for the user, this list is persisted and loaded 
     */
    private List<Map<String, String>> recentSearchesList;
    
    /**
     * This is a Codename One initialization callback that is invoked when the app is started
     */    
    public void init(Object context) {
        // loading the theme of the application
        Resources theme = UIManager.initFirstTheme("/theme");

        // the specification requires that only portrait would be supported
        Display.getInstance().lockOrientation(true);

        Toolbar.setGlobalToolbar(true);
        
        // We load the images that are stored in the resource file here so we can use them later
        placeholder = (EncodedImage)theme.getImage("placeholder");
        favoriteSel = FontImage.createMaterial(FontImage.MATERIAL_STAR, "TitleCommand", 3.5f);
        favoriteUnsel = FontImage.createMaterial(FontImage.MATERIAL_STAR_BORDER, "TitleCommand", 3.5f);

        // We initialize the lists of favorites and recent entries here, we load them from storage and save
        // them whenever we change them
        favoritesList = (List<Map<String, Object>>)Storage.getInstance().readObject("favoritesList");
        if(favoritesList == null) {
            favoritesList = new ArrayList<>();
        }
        recentSearchesList = (List<Map<String, String>>)Storage.getInstance().readObject("recentSearches");
        if(recentSearchesList == null) {
            recentSearchesList = new ArrayList<>();
        }
    }
    
    /**
     * This is a callback from Codename One, its invoked when the app is started and whenever it is restored from
     * the minimized state
     */
    public void start() {
        if(current != null){
            current.show();
            return;
        }
        // we show the main UI the first time around
        showMainForm(false, null, null);
    }
    
    /**
     * This method shows the main user interface of the app
     * 
     * @param back indicates if we are currently going back to the main form which will display it with a back transition
     * @param errorMessage an error message in case we are returning from a search error
     * @param listings the listing of alternate spellings in case there was an error on the server that wants us to prompt the user
     * for different spellings
     */
    private void showMainForm(boolean back, String errorMessage, List<Map<String, Object>> listings) {
        // we initialize the main form and add the favorites command so we can navigate there
        // we use border layout so the list will take up all the available space
        Form hi = new Form("PropertyCross", new BorderLayout());
        hi.getToolbar().addCommandToRightBar("Favs", null, e -> showFavs());
        hi.getToolbar().setTitleCentered(true);
        
        final TextField search = new TextField("", "Search", 20, TextArea.ANY);
        
        // the component group gives the buttons and text field that rounded corner iOS look when running on iOS. It does nothing on other platforms by default
        Button go = new Button("Go");
        Button myLocation = new Button("My Location");
        ComponentGroup gp = ComponentGroup.enclose(search, go, myLocation);
        
        // this allows the "Done" button in the virtual keyboard to perform the search and also binds to the Go button.
        ActionListener plainTextSearch = evt -> {
            if(search.getText().length() > 1) {
                performSearch(search.getText(), null);
            } else {
                Dialog.show("Error", "You need to enter a search string", "OK", null);
            }
        };
        search.setDoneListener(plainTextSearch);
        go.addActionListener(plainTextSearch);
        
        // we use the GPS to search for location and if its unavailble we just try to get the last known location
        myLocation.addActionListener(evt -> {
            InfiniteProgress ip = new InfiniteProgress();
            Dialog dlg = ip.showInifiniteBlocking();
            Location l = LocationManager.getLocationManager().getCurrentLocationSync(30000);
            dlg.dispose();
            if(l == null) {
                // fallback to estimate location
                try {
                    l = LocationManager.getLocationManager().getCurrentLocation();
                } catch(IOException err) {
                    Dialog.show("Error", "Failed in location lookup", "OK", null);
                    return;
                }
            }
            performSearch(null, l);
        });
        
        // we place the other elements in the box Y layout so they are one on top of the other
        Container boxY = BoxLayout.encloseY(
            new SpanLabel("Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My Location', to search in your current location!"),
                gp);
        hi.add(BorderLayout.NORTH, boxY);
        
        // if there is a pending error message we show that since its the most important
        if(errorMessage != null) {
                hi.add(BorderLayout.CENTER, new SpanLabel(errorMessage));
        } else {
            // if there is a listing to pick from we will show that
            if(listings != null) {
                // we create a list of the results returned from the server and map the result list to the JSON name (long_title)
                boxY.add("Please select a location below");
                final MultiList actualLocation = new MultiList();
                actualLocation.getSelectedButton().setNameLine1("long_title");
                actualLocation.getUnselectedButton().setNameLine1("long_title");
                actualLocation.setModel(new DefaultListModel(listings));
                hi.add(BorderLayout.CENTER, actualLocation);
                actualLocation.addActionListener(evt -> {
                    // when the user selects and entry from the list we navigate to the actual search result entry
                    Map<String, Object> sel = (Map<String, Object>)actualLocation.getSelectedItem();
                    performSearch((String)sel.get("place_name"), null);
                });               
            } else {
                // otherwise we try to show the recent searches if there are any available
                if(recentSearchesList.size() > 0) {
                    // recent searches are already stored in a way that is very friendly to list model so we can just show it
                    // we switch the list to horizontal layout mode so it will display more closely to the design
                    boxY.add(new Label("Recent Searches"));
                    final MultiList recentSearches = new MultiList();
                    recentSearches.getUnselectedButton().setHorizontalLayout(true);
                    recentSearches.getSelectedButton().setHorizontalLayout(true);
                    recentSearches.setModel(new DefaultListModel(recentSearchesList));
                    hi.add(BorderLayout.CENTER, recentSearches);
                    recentSearches.addActionListener(evt -> {
                        Map<String, String> selection = (Map<String, String>)recentSearches.getSelectedItem();
                        performSearch((String)selection.get("Line1"), null);
                    });
                } else {
                    boxY.add(new Label("There are no recent searches"));
                }
            }
        }
        
        // if we are returning from another form we want the transition animation to slide backwards
        if(back) {
            hi.showBack();
        } else {
            hi.show();
        }
    }

    /**
     * Helper method to implement the back command to the main form
     * @param f the form from which we would be returning
     */
    private void addBackToHome(Form f) {
        // the back command maps to the physical button on devices other than iPhone and creates the back arrow 
        // appearance on iOS
        f.getToolbar().setBackCommand("PropertyCross", BACK_POLICY,  e -> showMainForm(true, null, null));
        f.getToolbar().setTitleCentered(true);
    }
    
    private String guid(Map<String, Object> currentListing) {
        String guid = (String)currentListing.get("guid");
                    
        if(guid == null) {
            String thumb_url = (String)currentListing.get("thumb_url");
            guid = thumb_url.replace('/', '_').replace(':', '_').replace('&', '_').replace('?', '_');
        }
        
        return guid;
    }
    
    /**
     * Opens the search form to perform the search once we get results, if we get an error it returns to the main form
     * otherwise it will start rendering them locally
     * @param text the search text if applicable or null
     * @param l the location for a location search or null
     */
    void performSearch(final String text, final Location l) {
        // the form is initilized when there are no results so the title is different from the design, as results come in we set the title correctly
        final Form searchResults = new Form("Searching...", new BoxLayout(BoxLayout.Y_AXIS));
        addBackToHome(searchResults);
        
        // Codename One includes an ability to "infinitely scroll" which is more convenient than the "more" button 
        // approach. This works thru a callback to the runnable that fetches the additional results and we scroll
        // down the list
        InfiniteScrollAdapter.createInfiniteScroll(searchResults.getContentPane(), new Runnable() {
            private int currentPage = 1;
            private int totalPages;
            private String totalResults;
            
            /**
             * This method is invoked when the user reaches the bottom of the form and there are still more results
             */
            public void run() {
                // the fetch property data invokes the webservice and returns the parsed data as a Map of strings/objects
                // it also handles caching 
                Map<String, Object> results = fetchPropertyData(text, l, currentPage);
                Map<String, Object> response = (Map<String, Object>)results.get("response");
                
                List<Map<String, Object>> listings = (List<Map<String, Object>>)response.get("listings");
                String responseCode = (String)response.get("application_response_code");
                if(currentPage == 1) {
                    // this is the first page we need to initialize and handle some error cases
                    if(responseCode.equals("101") || responseCode.equals("100") || responseCode.equals("110")) {
                        if(listings.size() == 0) {
                            // return an error message if there are no listings for that search
                            showMainForm(true, "No listings found", null);
                            return;
                        }
                    } else {
                        if(responseCode.equals("200") || responseCode.equals("202") && listings != null && listings.size() > 0) {
                            // return to the main form with a set of alternate spellings for the location
                            showMainForm(true, null, (List<Map<String, Object>>)response.get("locations"));
                        } else {
                            // return a generic error message
                            String responseText = (String)response.get("application_response_text");
                            showMainForm(true, "Unknown response code returned: " + responseCode + "\n" + responseText, null);
                        }
                        return;
                    }
                    
                    Double totalPageCount = (Double)response.get("total_pages");
                    totalResults = "" + ((Double)response.get("total_results")).intValue();
                    totalPages = totalPageCount.intValue();
                    if(text != null) {
                        // if the search was successful and it isn't yet in the recent search list we should add it to the recent searches
                        Map<String, String> data = new HashMap<>();
                        data.put("Line1", text);
                        data.put("Line2", "(" + totalResults + ")");
                        if(!recentSearchesList.contains(data)) {
                            recentSearchesList.add(data);
                            Storage.getInstance().writeObject("recentSearches", recentSearchesList);
                        }
                    }
                }
                
                // we can now iterate over all the listings and create a component representing each listing which we 
                // can then add into the UI
                Component[] listingsToAdd = new Component[listings.size()];
                for(int iter = 0 ; iter < listingsToAdd.length ; iter++) {
                    MultiButton mb = new MultiButton();
                    final Map<String, Object> currentListing = listings.get(iter);
                    String thumb_url = (String)currentListing.get("thumb_url");
                    String guid = guid(currentListing);
                    String price_formatted = (String)currentListing.get("price_formatted");
                    String summary = (String)currentListing.get("summary");
                    
                    // URLImage seamlessly fetches and caches the image from the internet as it is needed. It scales the image in an attractive way to 
                    // match the device propotions/alignment. We use the GUID of the property as a unique name for caching.
                    mb.setIcon(URLImage.createToStorage(placeholder, guid, thumb_url, URLImage.RESIZE_SCALE_TO_FILL));
                    mb.setTextLine1(price_formatted);
                    mb.setTextLine2(summary);
                    listingsToAdd[iter] = mb;
                    
                    // if a property is clicked this will navigate to the property details
                    mb.addActionListener(evt -> {
                        showPropertyDetails(searchResults, currentListing);
                    });
                }
                
                currentPage++;
                
                // we now add the additional components to the form and also pass a boolean value as the last argument that indicates
                // whether more results will be coming. If we reached the last page of results this method will no longer be invoked
                InfiniteScrollAdapter.addMoreComponents(searchResults.getContentPane(), listingsToAdd, currentPage <= totalPages);
                
                // We update the title with every page. For simplicities sake we just used the number of components to check how many
                // entries we already have. However, the infinite scroll adds a progress indicator component that slightly breaks the calculations
                // once we finished scrolling this component is no longer there so we don't need the -1
                if(currentPage <= totalPages) {
                    searchResults.setTitle((searchResults.getContentPane().getComponentCount() - 1) + " of " + totalResults );
                } else {
                    searchResults.setTitle(searchResults.getContentPane().getComponentCount() + " of " + totalResults );
                }
            }
        }, true);
        
        searchResults.show();
    }

    /**
     * Shows the full details of the given property
     * @param previousForm the form to which we need to go back if the back button is pressed
     * @param currentListing the listing details
     */
    void showPropertyDetails(final Form previousForm, final Map<String, Object> currentListing) {
        final Form propertyDetails = new Form("Property Details", new BoxLayout(BoxLayout.Y_AXIS));
        
        // we check whether the current entry is marked as favorite via its unique ID from the server
        // if it is a favorite we use the selected icon for the command (a filled star) otherwise we use the 
        // unselected icon
        String guid = guid(currentListing);
        final boolean isFavorite = isFavorite(guid);
        Image fav = favoriteUnsel;
        if(isFavorite) {
            fav = favoriteSel;
        }
        
        // the favorite command removes/adds itself to toggle the icon as it is touched
        Command favoriteCommand = new Command("", fav) {
            boolean mode = isFavorite;
            @Override
            public void actionPerformed(ActionEvent evt) {
                mode = !mode;
                setFavorite(currentListing, mode);
                Button b = propertyDetails.getToolbar().findCommandComponent(this);
                if(mode) {
                    b.setIcon(favoriteSel);
                } else {
                    b.setIcon(favoriteUnsel);
                }
            }
        };
        propertyDetails.getToolbar().addCommandToRightBar(favoriteCommand);
        
        // we set the back command to just slide back to the search results
        propertyDetails.getToolbar().setBackCommand("Results", BACK_POLICY, e -> previousForm.showBack());
        propertyDetails.getToolbar().setTitleCentered(true);

        String price_formatted = (String)currentListing.get("price_formatted");
        String title = (String)currentListing.get("title");
        String img_url = (String)currentListing.get("img_url");
                
        // we create a placeholder image for the wide image dynamically so it will be just the right size for the screen
        if(largePlaceholder == null) {
            Image tmp = Image.createImage(Display.getInstance().getDisplayWidth(), Display.getInstance().getDisplayWidth() / 4 * 3, 0);
            largePlaceholder = EncodedImage.createFromImage(tmp, false);
        }
        
        Object bathroom_number = currentListing.get("bathroom_number");
        Object bedroom_number = currentListing.get("bedroom_number");
        String struct = "";
        if(bedroom_number != null && bedroom_number instanceof Double) {
            struct = ((Double)bedroom_number).intValue() + " bedroom";
            if(bathroom_number != null && bathroom_number instanceof Double) {
                struct += ", " + ((Double)bathroom_number).intValue() + " bathroom";
            }
        } else {
            if(bathroom_number != null && bathroom_number instanceof Double) {
                struct = ((Double)bathroom_number).intValue() + " bathroom";
            }
        }
        String summary = (String)currentListing.get("summary");
        
        // we set the title and second title to have larger presence in the UI so they will be more attractive
        // the full width version of the image is downloaded dynamically into place and cached with the URLImage class
        propertyDetails.add(new Label(price_formatted, "LargeTitle")).
                add(new Label(title, "SecondaryTitle")).
                add(new Label(URLImage.createToStorage(largePlaceholder, "L" + guid, img_url, URLImage.RESIZE_SCALE_TO_FILL))).
                add(struct).
                add(new SpanLabel(summary));
        
        propertyDetails.show();
    }
    
    /**
     * This method fetches, caches and parses the data, it does it synchronously which makes its usage very simple. 
     * 
     * @param text the text to search for or null for location search
     * @param l the location to search for or null for text search
     * @param pageNumber the number of the page
     * @return the search results parsed to a Map hierarchy or null in case of a failure
     */
    Map<String, Object> fetchPropertyData(String text, Location l, final int pageNumber) {
        // we just cache the data relatively simply into two maps
        if(text != null) {
            Map<Integer, Map<String, Object>> cacheMap = (Map<Integer, Map<String, Object>>)cachedSearches.get(text);
            if(cacheMap != null) {
                Map<String, Object> val = cacheMap.get(pageNumber);
                if(val != null) {
                    return val;
                }
            } else {
                cachedSearches.put(text, new HashMap<>());
            }
        } else {
            Map<Integer, Map<String, Object>> cacheMap = (Map<Integer, Map<String, Object>>)cachedLocationSearches.get(l);
            if(cacheMap != null) {
                Map<String, Object> val = cacheMap.get(pageNumber);
                if(val != null) {
                    return val;
                }
            } else {
                cachedLocationSearches.put(l, new HashMap<>());
            }
        }
        
        // this class implements the network connection and parsing
        class MR extends ConnectionRequest {
            public Map<String, Object> results;
            
            @Override
            protected void readResponse(InputStream input) throws IOException {
                JSONParser jp = new JSONParser();
                // this is a relatively simple builtin parser that converts JSON into a Map hierarchy
                results = jp.parseJSON(new InputStreamReader(input, "UTF-8"));
            }

            @Override
            protected void handleErrorResponseCode(int code, String message) {
                showError("The server returned the error code: " + code);
            }

            @Override
            protected void handleException(Exception err) {
                showError("There was a connection error: " + err);
            }
            
            // we show an error either in the main form or in a dialog, for later pages it means we got an error during scrolling so we will use a dialog
            private void showError(final String message) {
                // call serially is used since we are not on the event disaptch thread during error callbacks
                Display.getInstance().callSerially(() -> {
                    if(pageNumber == 1) {
                        showMainForm(true, message, null);
                    } else {
                        Dialog.show("Error", message, "OK", null);
                    }
                });
            }
        }
        
        // here we create the request and the arguments, everything is seamlessly encoded and adapted
        MR r = new MR();
        r.setPost(false);
        r.setUrl("http://api.nestoria.co.uk/api");
        r.addArgument("pretty", "0");
        r.addArgument("action", "search_listings");
        r.addArgument("encoding", "json");
        r.addArgument("listing_type", "buy");
        r.addArgument("page", "" + pageNumber);
        if(text != null) {
            r.addArgument("country", "uk");
            r.addArgument("place_name", text);
        } else {
            r.addArgument("centre_point", l.getLatitude() + "," + l.getLongitude());
        }
        
        // this call blocks the caller thread in a way that doesn't block execution, e.g. even if invoked on the main dispatch
        // thread this would still be legal
        NetworkManager.getInstance().addToQueueAndWait(r);
        if(r.results != null) {
            // results are placed in the cache for next time, since images are cached to storage this shouldn't take up too much RAM even
            // for long executions
            if(text != null) {
                Map<Integer, Map<String, Object>> cacheMap = (Map<Integer, Map<String, Object>>)cachedSearches.get(text);
                cacheMap.put(pageNumber, r.results);
            } else {
                Map<Integer, Map<String, Object>> cacheMap = (Map<Integer, Map<String, Object>>)cachedLocationSearches.get(l);
                cacheMap.put(pageNumber, r.results);
            }
        } 
        return r.results;
    }

    /**
     * Shows the favorites screen 
     */
    void showFavs() {
        final Form favsForm = new Form("Favourites", new BoxLayout(BoxLayout.Y_AXIS));
        addBackToHome(favsForm);
        if(favoritesList.size() == 0) {
            favsForm.add(new SpanLabel("You have not added any properties to your favourites"));
        } else {
            // this is really trivial we just take the favorites and show them as a set of buttons
            for(Map<String, Object> c : favoritesList) {
                MultiButton mb = new MultiButton();
                final Map<String, Object> currentListing = c;
                String thumb_url = (String)currentListing.get("thumb_url");
                String guid = guid(currentListing);
                String price_formatted = (String)currentListing.get("price_formatted");
                String summary = (String)currentListing.get("summary");
                mb.setIcon(URLImage.createToStorage(placeholder, guid, thumb_url, URLImage.RESIZE_SCALE_TO_FILL));
                mb.setTextLine1(price_formatted);
                mb.setTextLine2(summary);
                mb.addActionListener(evt -> showPropertyDetails(favsForm, currentListing));
                favsForm.add(mb);
            }
        }
        favsForm.show();
    }
    
    /**
     * Checks if a given entry is in the favorites list
     * @param guid the unique id for the entry
     * @return  true if its a favorite, false otherwise
     */
    boolean isFavorite(String guid) {
        for(Map<String, Object> c : favoritesList) {
            if(guid(c).equals(guid)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Toggles the favorite state and saves it to storage
     * @param currentListing the listing to toggle the state of
     * @param fav the new favorite state
     */
    void setFavorite(Map<String, Object> currentListing, boolean fav) {
        if(fav) {
            favoritesList.add(currentListing);
            Storage.getInstance().writeObject("favoritesList", favoritesList);
        } else {
            String guid = guid(currentListing);
            for(Map<String, Object> c : favoritesList) {
                if(guid(currentListing).equals(guid)) {
                    favoritesList.remove(c);
                    Storage.getInstance().writeObject("favoritesList", favoritesList);
                    return;
                }
            }
        }
    }
    
    /**
     * Callback from Codename One indicating the app is minimized into background
     */
    public void stop() {
        current = Display.getInstance().getCurrent();
    }
        
    /**
     * Callback from Codename One indicating the app is exiting
     */
    public void destroy() {
    }    
}