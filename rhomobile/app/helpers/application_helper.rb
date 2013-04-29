module ApplicationHelper
  def strip_braces(str=nil)
    str ? str.gsub(/\{/, "").gsub(/\}/, "") : nil
  end

  def strike_if(str, condition=true)
    condition ? "<s>#{str}</s>" : str
  end

  def display_blanks(value)
    if blank?(value)
      "---"
    else
      value
    end
  end

  def blank?(value)
    value.nil? || value == "" || value.length==0
  end

  def display_blankstr(value)
    if blank?(value)
      " "
    else
      value
    end
  end

  def display_newline()
    "<br>"
  end

  def display_space()
    " "
  end

  def display_dollars(value)
    if blank?(value)
      " "
    else
      number = "$" + sprintf("%.2f", value)

      # use a commify algorithm -- http://snippets.dzone.com/tag/commify
      number.reverse!
      number.gsub!(/(\d\d\d)(?=\d)(?!\d*\.)/, '\1,')
      number.reverse!
    end
  end

  def display_number(value)
    if blank?(value)
      " "
    else
      sprintf("%.2f", value)
    end
  end

  def both_items_present?(value1, value2)
    !blank?(value1) && !blank?(value2)
  end

  def replace_newlines(value)
    if blank?(value)
      " "
    else
      value.gsub('\n', ' ')
    end
  end

  def format_address_for_mapping(street, city, state, zip, tagforurl)
    # handle case where fields could be nil
    mystreet = !street.nil? ? street : ""
    mycity = !city.nil? ? city : ""
    mystate = !state.nil? ? state : ""
    myzip = !zip.nil? ? zip : ""

    result = ""
    if !tagforurl
      # build up address string
      result += (mystreet + ", ") if mystreet.length > 0
      result += (mycity + ", ") if mycity.length > 0
      result += (mystate + " ") if mystate.length > 0
      result += myzip if myzip.length > 0
    else
      # need to URL encode data too
      result += ("&street=" + Rho::RhoSupport.url_encode(mystreet)) if mystreet.length > 0
      result += ("&city=" + Rho::RhoSupport.url_encode(mycity)) if mycity.length > 0
      result += ("&state=" + Rho::RhoSupport.url_encode(mystate)) if mystate.length > 0
      result += ("&zip=" + Rho::RhoSupport.url_encode(myzip)) if myzip.length > 0
    end
    # remove any extraneous characters that could interfere with proper address matching
    result = replace_newlines(result)
  end

  def has_valid_mapping_address(street, city, state, zip)
    # at a minimum, an address must have a state or a zip
    (!state.nil? && state.length > 0) || (!zip.nil? && zip.length > 0)
  end

  def format_latlon_for_mapping(latitude, longitude)
    result = ""
    result += ("&latitude=" + Rho::RhoSupport.url_encode(latitude)) if latitude.length > 0
    result += ("&longitude=" + Rho::RhoSupport.url_encode(longitude)) if longitude.length > 0
    result
  end

  def render_transition(params)
    @params["rho_callback"] = nil
    params[:layout] = false
    tab_index = params[:tab_index]
    tab_index = -1 if tab_index == nil
    # TODO: escape carriage returns instead of removing them altoegether
    content = render(params).split('\'').join('\\\'').split(/[\r\n]/).join('')
    content = content.unpack("U*").collect {|s| (s > 127 ? "&##{s};" : s.chr) }.join("")
    WebView.execute_js("Rho.insertAsyncPage('<div>#{content}</div>')", tab_index)
  end

  def caller_request_hash_to_query
    require 'json'
    'caller_request=' + Rho::RhoSupport.url_encode(::JSON.generate(@request))
  end

  def caller_request_query_to_hash
    @caller_request = Rho::JSON.parse(@params['caller_request']) if @params['caller_request']
  end

  def thousand_separator(number)
    number = number.to_s.reverse
    number.gsub!(/(\d\d\d)(?=\d)(?!\d*\.)/) do |match|
      $1 + ','
    end
    number = number.to_s.reverse
  end

  def escape_javascript(javascript)
    a = {
      '\\' => '\\\\',
      '</' => '<\/',
      "\r\n" => '\n',
      "\n" => '\n',
      "\r" => '\n',
      '"' => '\\"',
      "'" => "\\'"
    }
    if javascript
      result = javascript.gsub(/(\\|<\/|\r\n|\342\200\250|[\n\r"'])/u) {|match| a[match] }
    else
      ''
    end
  end

end
