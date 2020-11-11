class ApplicationController < ActionController::Base
  layout "application"
  # Include custom auth system. This is in extras/auth_system.rb
  include AuthSystem

  def get_current_page
    session[:current_page]
  end

  def save_current_page(name)
    session[:current_page] = name
  end
  #
  # Show template with links to supported oauth providers.
  # Once they login they will be forwarded to their requested resource.
  def require_login
    save_current_page("LOGIN")
    
    setup_session(2)
    render :template => 'shared/login' unless logged_in?
    true
  end


  # Forgery protection, a rails default.
  protect_from_forgery

  protected

end
