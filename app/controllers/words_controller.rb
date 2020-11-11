class WordsController < ApplicationController
  # GET /words
  # GET /words.xml
  def index
    @words = Word.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @words }
    end
  end

  # GET /words/1
  # GET /words/1.xml
  def show
    @word = Word.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @word }
    end
  end

  # GET /words/new
  # GET /words/new.xml
  def new
    @word = Word.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @word }
    end
  end

  # GET /words/1/edit
  def edit
    @word = Word.find(params[:id])
  end

  def say_word
    word = params[:word]
    response = HTTParty.get("http://translate.google.com/translate_tts?tl=en&q=#{word}")
    if (response.body) 
      f = File.new(::Rails.root.to_s + "/public/assets/audio.mp3", "wb")
      f.write(response.body)
      f.close
    end
    render :nothing => true
  end

  # POST /words
  # POST /words.xml
  def create
    @word = Word.new(params[:word])
    success = @word.create_or_update
    respond_to do |format|
      if success && @word.save
        format.html { redirect_to(@word, :notice => 'Word was successfully created.') }
        format.xml  { render :xml => @word, :status => :created, :location => @word }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @word.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /words/1
  # PUT /words/1.xml
  def update
    @word = Word.find(params[:id])
    success = false
    success = @word.create_or_update if @word

    respond_to do |format|
      if success
        format.html { redirect_to(@word, :notice => 'Word was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @word.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /words/1
  # DELETE /words/1.xml
  def destroy
    @word = Word.find(params[:id])
    @word.destroy

    respond_to do |format|
      format.html { redirect_to(words_url) }
      format.xml  { head :ok }
    end
  end
end
