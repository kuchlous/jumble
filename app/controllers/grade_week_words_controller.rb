class GradeWeekWordsController < ApplicationController
  # GET /grade_week_words
  # GET /grade_week_words.json
  def index
    @grade_week_words = GradeWeekWord.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @grade_week_words }
    end
  end

  # GET /grade_week_words/1
  # GET /grade_week_words/1.json
  def show
    @grade_week_word = GradeWeekWord.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @grade_week_word }
    end
  end

  # GET /grade_week_words/new
  # GET /grade_week_words/new.json
  def new
    @grade_week_word = GradeWeekWord.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @grade_week_word }
    end
  end

  # GET /grade_week_words/1/edit
  def edit
    @grade_week_word = GradeWeekWord.find(params[:id])
  end

  # POST /grade_week_words
  # POST /grade_week_words.json
  def create
    @grade_week_word = GradeWeekWord.new(params[:grade_week_word])

    respond_to do |format|
      if @grade_week_word.save
        format.html { redirect_to @grade_week_word, notice: 'Grade week word was successfully created.' }
        format.json { render json: @grade_week_word, status: :created, location: @grade_week_word }
      else
        format.html { render action: "new" }
        format.json { render json: @grade_week_word.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /grade_week_words/1
  # PUT /grade_week_words/1.json
  def update
    @grade_week_word = GradeWeekWord.find(params[:id])

    respond_to do |format|
      if @grade_week_word.update_attributes(params[:grade_week_word])
        format.html { redirect_to @grade_week_word, notice: 'Grade week word was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @grade_week_word.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /grade_week_words/1
  # DELETE /grade_week_words/1.json
  def destroy
    @grade_week_word = GradeWeekWord.find(params[:id])
    @grade_week_word.destroy

    respond_to do |format|
      format.html { redirect_to grade_week_words_url }
      format.json { head :ok }
    end
  end
end
