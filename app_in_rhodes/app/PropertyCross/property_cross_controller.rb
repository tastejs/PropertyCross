require 'rho/rhocontroller'
require 'helpers/browser_helper'
require 'helpers/application_helper'

class PropertyCrossController < Rho::RhoController
  include BrowserHelper
  include ApplicationHelper
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

  private

  def decide_redirection(application_response_code, result, place_name)
    if application_response_code == "100" || application_response_code == "101"
      listings = result["body"]["response"]["listings"]
    elsif  application_response_code == "201" || application_response_code == "500"
      WebView.execute_js("error_message('The location given was not recognised.');")
    end
  end

end
