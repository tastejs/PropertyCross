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

  def recent_search(recent_search_result)
    recent_search_info = "<div> <h4> Recent Searches </h4></div>"
    recent_search_info+="<ul data-role=listview data-inset=true style=margin:0px; >"+recent_search_li_formation(recent_search_result)+"</ul>"
    recent_search_info
  end

  def recent_search_li_formation(recent_search_result)
    li_formation = ""
    recent_search_result.each do |recent_search_result|
      if recent_search_result.place_name.to_i == 0
        li_formation+="<li data-theme=c class=recent_search_li><a href=#>"+recent_search_result.place_name+"</a><span class=misspelt_place_name>"+recent_search_result.place_name+"</span><span class=ui-li-count>"+recent_search_result.count+"</span></li>"
      else
        li_formation+="<li data-theme=c class=recent_search_li><a href=#>"+recent_search_result.place_name+"</a><span class=misspelt_place_name id=recent_search_by_my_location>"+recent_search_result.place_name+"</span><span class=ui-li-count>"+recent_search_result.count+"</span></li>"
      end
    end
    li_formation
  end

end