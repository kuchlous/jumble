# Bring in ProviderInfo class that interfaces with config/providers.yml.
require 'provider_info'

# Load providers module
require 'providers'

# Bring in libraries we need for API's
require 'google/api_client'
require 'httpadapter/adapters/net_http'

# Bring in strategies
require 'omniauth-google-oauth2'
require 'omniauth-facebook'
require 'omniauth-twitter'

ENV['CA_FILE'] = '/etc/ssl/certs/ca-certificates.crt'

# Instantiate ProviderInfo class.
# YAML data is returned by the settings method.
pinfo = ProviderInfo.new.settings

# Twitter.configure do |config|
#   config.consumer_key = pinfo['twitter']['key']
#   config.consumer_secret = pinfo['twitter']['secret']
# end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, pinfo['google']['key'], pinfo['google']['secret'], {
    :scope => pinfo['google']['scope'],
    :client_options => {:ssl => {:ca_file => "/etc/ssl/certs/ca-certificates.crt"}}
  }
  

  provider :facebook, pinfo['facebook']['key'], pinfo['facebook']['secret'], {
    :scope => pinfo['facebook']['scope'],
    :client_options => {:ssl => {:ca_file => "/etc/ssl/certs/ca-certificates.crt"}}
  }
  
  provider :twitter, pinfo['twitter']['key'], pinfo['twitter']['secret'], {
    :scope => pinfo['twitter']['scope'],
    :client_options => {:ssl => {:ca_file => "/etc/ssl/certs/ca-certificates.crt"}}
  }
end
