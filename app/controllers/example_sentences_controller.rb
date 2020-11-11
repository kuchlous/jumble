class ExampleSentencesController < ApplicationController
  # GET /example_sentences
  # GET /example_sentences.json
  def index
    @example_sentences = ExampleSentence.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @example_sentences }
    end
  end

  # GET /example_sentences/1
  # GET /example_sentences/1.json
  def show
    @example_sentence = ExampleSentence.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @example_sentence }
    end
  end

  # GET /example_sentences/new
  # GET /example_sentences/new.json
  def new
    @example_sentence = ExampleSentence.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @example_sentence }
    end
  end

  # GET /example_sentences/1/edit
  def edit
    @example_sentence = ExampleSentence.find(params[:id])
  end

  # POST /example_sentences
  # POST /example_sentences.json
  def create
    @example_sentence = ExampleSentence.new(params[:example_sentence])

    respond_to do |format|
      if @example_sentence.save
        format.html { redirect_to @example_sentence, notice: 'Example sentence was successfully created.' }
        format.json { render json: @example_sentence, status: :created, location: @example_sentence }
      else
        format.html { render action: "new" }
        format.json { render json: @example_sentence.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /example_sentences/1
  # PUT /example_sentences/1.json
  def update
    @example_sentence = ExampleSentence.find(params[:id])

    respond_to do |format|
      if @example_sentence.update_attributes(params[:example_sentence])
        format.html { redirect_to @example_sentence, notice: 'Example sentence was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @example_sentence.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /example_sentences/1
  # DELETE /example_sentences/1.json
  def destroy
    @example_sentence = ExampleSentence.find(params[:id])
    @example_sentence.destroy

    respond_to do |format|
      format.html { redirect_to example_sentences_url }
      format.json { head :ok }
    end
  end
end
