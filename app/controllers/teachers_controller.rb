class TeachersController < ApplicationController
  layout "teachers"

  def add_words
    save_current_page("AddWords")
  end

  def add_words_db
    save_current_page("AddWords")
    school = School.find(params[:school_id])
    year = params[:grade].to_i
    grade = Grade.find_all_by_year(year).find { |g| g.school == school} 
    grade ||= Grade.create(:school => school, :year => year) 
    word_str = params[:words]
    word_str = word_str.gsub(/\n/, ' ').gsub(/,/, ' ').gsub(/\s+/, ' ')
    words = word_str.split(' ')
    words.collect! { |word| word.chomp }

    words.each do |word|
      word = word.downcase
      jword = Word.find_by_word(word)
      jword ||= Word.create(:word=>word, :grade => year)
      start_of_week = Date.today.beginning_of_week
      gww = GradeWeekWord.find { |g| ((g.date_start_of_week == start_of_week) &&
                                      (g.word == jword) &&
                                      (g.grade == grade))
                               }

      if (!gww)
        logger.info("Created new gww for #{word}, grade #{year}, school #{school.name}")
        GradeWeekWord.create(:word => jword, :grade => grade, :date_start_of_week => start_of_week)
      end
    end
    command = "cd " + ::Rails.root.to_s + "; ./script/set_up_new_words.sh &"
    system(command)

    @school = school
    @grade = grade
    @words = words
    @year = year
  end

  def input_word_box
    save_current_page("WordBox")
  end

  def make_word_box
    save_current_page("WordBox")
    word_str = params[:words]
    if (!word_str) 
      redirect_to :action => "input_word_box"
    else
      word_str = word_str.gsub(/\n/, ' ').gsub(/,/, ' ').gsub(/\s+/, ' ')
      words = word_str.split(' ')
      words.collect! { |word| word.chomp }
      words.collect! { |word| word.downcase }

      jwords = []
      words.each do |word|
        jword = Word.find_by_word(word)
        jword ||= Word.create(:word=>word)
        jwords << jword
      end

      command = "cd " + ::Rails.root.to_s + "; ./script/set_up_new_words.sh &"
      system(command)

      @words = jwords
      @is_teacher = true
      render "home/find_words"
    end
  end

  def create_random_word_box
    save_current_page("WordBox")
    jwords = Word.all.shuffle[0..9]
    @words = jwords
    @is_teacher = true
    render "home/find_words"
  end

  def print_word_box
    save_current_page("WordBox")
    word_array_json = params[:box_json]
    words_fit_json = params[:words_fit_json]
    word_box_id = params[:id]
    if (word_box_id)
      word_box = WordBox.find(word_box_id)
      @word_array_json = word_box.word_array_json
      @words_fit_json = word_box.words_fit_json
      @word_array = JSON.parse(@words_fit_json)
      @words_fit = JSON.parse(@words_fit_json)
      @word_box_id = word_box_id
      render "print_word_box", :layout => false
    else
      word_box = WordBox.find_by_word_array_json(word_array_json)
      @word_box = nil
      if (word_box)
        @word_box = word_box
      else
        @word_box = WordBox.create(:word_array_json => word_array_json, :words_fit_json => words_fit_json)
      end
      @word_box_id = @word_box.id
      render "return_word_box_id", :layout => false
    end
  end

  def save_word_box
  end
end
