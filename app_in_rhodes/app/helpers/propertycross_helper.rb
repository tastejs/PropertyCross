module PropertycrossHelper
  def misspelt_location(locations)
    missplet_location_info = "<div><h4>Please select a location below:</h4></div>"
    missplet_location_info+="<ul data-role=listview data-inset=true style=margin:0px; >"+li_formation(locations)+"</ul>"
    missplet_location_info
  end

  def li_formation(locations)
    li_formation = ""
    locations.each do |location|
      li_formation+="<li data-theme=c class=misspelt_place_li><a href=#>"+location['long_title']+"</a><span class=misspelt_place_name>"+location['place_name']+"</span></li>"
    end
    li_formation
  end

end