<?xml version="1.0"?>
<urs xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:noNamespaceSchemaLocation="/XSD/3.6.0/urs.xsd">
    <parameters>
        <mainclassname>PropertyCross</mainclassname>
        <applicationname>PropertyCross</applicationname>
        <packagename>com.propertycross.neomad</packagename>
        <icon path="res/Icons/others/app.png">
        	<windowsphone tilebackgroundpath="res/Icons/metro/app.png" />
        </icon>
        <vendor>www.neomades.com</vendor>
        <version>1.0.0</version>
        <srcpath>src</srcpath>
        <outputpath>out</outputpath>
    </parameters>
    
    
    <binaryname filename="$PRODUCTNAME_$TARGET_$VERSION_$LANGUAGE"
                multilanguageseparator="_" suboutputpath="${TARGET_NAME}"/>
                
                
                
    <permissions>
        <permission name="LOCATION"/>
        <permission name="INTERNET"/>
        <permission name="NETWORK_STATE"/>
        <permission name="LOCATION_PROXIMITY"/>
    </permissions>
    
    
    <strings path="res/strings.csv"/>
    
    
    <resourcelot>
        <layout name="PROPERTY_SPLASH" path="res/layout/others/property_splash.xml"/>
        <layout name="PROPERTY_FINDER_SCREEN" path="res/layout/${LAYOUT_LIST_PATH}/property_finder_screen.xml"/>
        <layout name="PROPERTY_SEARCH_SCREEN" path="res/layout/${LAYOUT_PATH}/property_search_screen.xml"/>
        <layout name="PROPERTY_SEARCH_ROW" path="res/layout/${LAYOUT_PATH}/property_search_row.xml"/>
        <layout name="PROPERTY_SEARCH_FOOTER" path="res/layout/${LAYOUT_PATH}/property_search_footer.xml"/>
        <layout name="PROPERTY_RECENT_ROW" path="res/layout/${LAYOUT_PATH}/property_recent_row.xml"/>
        <layout name="PROPERTY_DETAIL_VIEW" path="res/layout/${LAYOUT_PATH}/property_detail_view.xml"/>
    </resourcelot>
    
    <resourcelot>
    	<image name="SCREEN_BG_IMAGE" path="res/image/background.jpg" condition="SCREEN_WITH_BG_IMAGE"/>
    </resourcelot>
    
    
    <resourcelot>
        <image name="STAR" path="res/Icons/${MENU_ITEM_PATH}/star.png"/>
        <image name="NO_STAR" path="res/Icons/${MENU_ITEM_PATH}/no_star.png"/>
        <image name="FAVS" path="res/Icons/favs.png"/>
    </resourcelot>
</urs>
