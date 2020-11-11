class UserSessionsController < ApplicationController
  before_action :require_no_user, :only => [:new, :create]
  before_action :require_user, :only => :destroy
  
  def new
    @user_session = UserSession.new
  end
  
  def create
    @user_session = UserSession.new(params[:user_session])
    @user_session.save do |result|
      if result
        flash[:notice] = "Login successful!"
        redirect_back_or_default :controller => 'home', :action => 'jumble'
      else
        logger.info("Login not successful")
        logger.info(@user_session.errors)
        render :action => :new
      end
    end
  end
  
  def destroy
    current_user_session.destroy
    logger.info ("Destroying session")
    flash[:notice] = "Logout successful!"
    redirect_to :action => 'new'
  end

  def show
    logger.info ("show session #{params}")
  end

  def index
  end

end
