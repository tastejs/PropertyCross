require 'rho/rhocontroller'
require 'helpers/browser_helper'
require 'helpers/application_helper'
require 'helpers/propertycross_helper'

class PropertyCrossController < Rho::RhoController
  include BrowserHelper
  include ApplicationHelper
  include PropertycrossHelper
  def search_listings
    if has_network?
      place_name = @params['place_name']
      url =  "http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&place_name=#{place_name}&page=1&encoding=json&listing_type=buy"
      result = Rho::AsyncHttp.get(:url => url)
      application_response_code = result["body"]["response"]["application_response_code"]
      if result['status'] == "ok"
        decide_redirection(application_response_code, result, place_name)
      end
    else
      WebView.execute_js("error_message('An error occurred while searching. Please check your network connection and try again.');")
    end
  end

  def search_results_view
    @listings = PropertyCross.find(:all)
  end

  def property_view
    @property_detail = PropertyCross.find(:all, :conditions => {"object"=>  @params['object']}).first
    if @property_detail == nil
      @property_detail = PropertyCross.find(:all, :conditions => {"guid"=>  @params['object']}).first
    end
    @favourite = Favourite.find(:all, :conditions => {"guid"=>  @property_detail.guid})
  end

  def add_to_favourite
    property =  PropertyCross.find(:all, :conditions => {"object"=>  @params['object']})
    property.each do |property|
      favourite = Favourite.find(:all, :conditions => {"guid"=>  property.guid})
      create_favourite_property(favourite.size, property)
    end
  end

  def favourities_list
    @favourities_list = Favourite.find(:all)
  end

  def favourite_property_view
    @favourite = Favourite.find(:all, :conditions => {"guid"=> @params['guid']})
    @property_detail = Favourite.find(:all, :conditions => {"guid"=> @params['guid']}).first
  end

  def remove_from_favourite
    Favourite.delete_all(:conditions => {"guid"=> @params['guid']})
  end

  def recent_search_list
    recent_search = RecentSearch.find(:all)
  end

  private

  def decide_redirection(application_response_code, result, place_name)
    if application_response_code == "100" || application_response_code == "101"
      listings = result["body"]["response"]["listings"]
      handle_correct_search_result(listings, result, place_name)
    elsif  application_response_code == "201" || application_response_code == "500"
      WebView.execute_js("error_message('The location given was not recognised.');")
    elsif application_response_code == "202" || application_response_code == "200"
      missplet_location_info = misspelt_location(result["body"]["response"] ["locations"])
      WebView.execute_js("misspelt_location('#{missplet_location_info}')")
    end
  end

  def handle_correct_search_result(listings, result, place_name)
    listings_size = listings.size
    if listings_size > 0
      location = result["body"]["response"] ["locations"][0]['place_name']
      total_number_of_property = result["body"]["response"]["total_results"]
      PropertyCross.delete_all
      create_property_cross(listings)
      handle_recent_search(place_name, total_number_of_property)
      WebView.navigate(url_for(:action => :search_results_view, :controller => :PropertyCross, :query => {:location => location, :total_results => total_number_of_property}))
    else
      WebView.execute_js("error_message('There were no properties found for the given location.');")
    end
  end

  def create_property_cross(listings)
    listings.each do |list|
      PropertyCross.create(list)
    end
  end

  def handle_recent_search(place_name, count)
    recent_search = RecentSearch.find(:all, :conditions => {"place_name"=> place_name})
    if recent_search.size == 0 && count != 0
      recent_search_hash = {"place_name"=> place_name, "count"=> count}
      RecentSearch.create(recent_search_hash)
    end
  end

  def create_favourite_property(favourite_size, property)
    if favourite_size == 0
      Favourite.create(property.vars.reject! {|k, v|  [:source_id, :object].include? k })
    end
  end

end
