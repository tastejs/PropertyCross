module PropertycrossHelper
  def misspelt_location(locations)
    missplet_location_info = "<div><h4>Please select a location below:</h4></div>"
    missplet_location_info+="<ul data-role=listview data-inset=true style=margin:0px; ></ul>"
    missplet_location_info
  end

end