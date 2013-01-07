require 'rho/rhocontroller'
require 'helpers/browser_helper'
require 'helpers/application_helper'

class PropertyCrossController < Rho::RhoController
  include BrowserHelper
  include ApplicationHelper
  def search_listings
    if has_network?
      place_name = @params['place_name']
    else
      WebView.execute_js("error_message('An error occurred while searching. Please check your network connection and try again.');")
    end
  end

end
