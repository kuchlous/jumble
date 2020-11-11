class MathController < ApplicationController
  before_action :require_login, :except => :privacy

  def index
  end

  def learn_table
    @number = params[:number].to_i
  end

  def practice_table
    @number = params[:number].to_i
  end

  def check_table
    @number = params[:number].to_i
  end

end

