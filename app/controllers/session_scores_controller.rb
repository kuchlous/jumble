class SessionScoresController < ApplicationController
  # GET /session_scores
  # GET /session_scores.json
  def index
    @session_scores = SessionScore.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @session_scores }
    end
  end

  # GET /session_scores/1
  # GET /session_scores/1.json
  def show
    @session_score = SessionScore.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @session_score }
    end
  end

  # GET /session_scores/new
  # GET /session_scores/new.json
  def new
    @session_score = SessionScore.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @session_score }
    end
  end

  # GET /session_scores/1/edit
  def edit
    @session_score = SessionScore.find(params[:id])
  end

  # POST /session_scores
  # POST /session_scores.json
  def create
    @session_score = SessionScore.new(params[:session_score])

    respond_to do |format|
      if @session_score.save
        format.html { redirect_to @session_score, notice: 'Session score was successfully created.' }
        format.json { render json: @session_score, status: :created, location: @session_score }
      else
        format.html { render action: "new" }
        format.json { render json: @session_score.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /session_scores/1
  # PUT /session_scores/1.json
  def update
    @session_score = SessionScore.find(params[:id])

    respond_to do |format|
      if @session_score.update_attributes(params[:session_score])
        format.html { redirect_to @session_score, notice: 'Session score was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @session_score.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /session_scores/1
  # DELETE /session_scores/1.json
  def destroy
    @session_score = SessionScore.find(params[:id])
    @session_score.destroy

    respond_to do |format|
      format.html { redirect_to session_scores_url }
      format.json { head :ok }
    end
  end
end
