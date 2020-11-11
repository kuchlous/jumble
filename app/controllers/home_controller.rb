class HomeController < ApplicationController
  before_action :require_login, :except => [:privacy, :about, :login_as_guest, :find_words]

  def home
    puts "home #{session[:current_user_id]}"
    save_current_page("Home")
  end

  def privacy
  end

  def find_words
    word_box_id = params[:id]
    if (word_box_id)
      word_box = WordBox.find(word_box_id)
      @word_array_json = word_box.word_array_json
      @words_fit_json = word_box.words_fit_json
      words_fit = JSON.parse(@words_fit_json)
      @words = []
      words_fit.each do |word, coords|
        @words << Word.find_by_word(word)
      end
      @word_box_id = word_box_id
    else
      @words = Word.all.shuffle[0..9]
    end
  end

  def login_as_guest
    guest = User.find_by_name("guest")
    setup_session(guest.id)
    redirect_to :root
  end

  def spell
    save_current_page("Spell Bee Words")
    render "choose_spell_level"
  end

  def choose_spell_level
    save_current_page("Spell Bee Words")
  end

  def find_wrong_attempts(user)
    last_status_for_words = {} 
    word_scores = user.word_scores.sort { |a, b| a.created_at <=> b.created_at }
    word_scores.each do |word_score|
      last_status_for_words[word_score.word] = word_score
    end

    wrong_words = {}
    correct_words = {}

    last_status_for_words.each do |word, word_score|
      if (word_score.skipped != 0) || (word_score.wrong != 0)
        wrong_words[word] = 1
      else
        correct_words[word] = 1
      end
    end

    [wrong_words, correct_words]
  end

  def common_words
    save_current_page("Common Words")
    words_per_session = 50

    wrong_attempts, correct_words = find_wrong_attempts(current_user)

    common_words = Word.all.find_all { |w| w.pop_rank && w.pop_rank < 6000 && w.word.size > 2 }.sort { |x, y| x.pop_rank <=> y.pop_rank }

    today_words = {}
    nwords = today_words.size

    common_words.each do |word|
      if (!correct_words[word] && !today_words[word])
        today_words[word] = 1
        nwords += 1
      end
      break if (nwords >= words_per_session)
    end

    if (nwords < words_per_session) 
      common_words.shuffle!
      common_words.each do |word|
        if (!today_words[word])
          today_words[word] = 1
          nwords += 1
        end
        break if (nwords >= words_per_session)
      end
    end

    @words = today_words.keys    
    @words = @words.find_all { |jword| jword.audio_types && jword.audio_types != "" }
    @stars = current_user.total_spell_stars
    @hangman_stars = current_user.total_hangman_stars
    render "spell"
  end

  def spell_class
    puts "In spell_class"
    save_current_page("Spell Bee Words")
    words_per_session = 50
    grade = params[:grade].to_i

    today_words, correct_words = find_wrong_attempts(current_user)
    nwords = today_words.size

    grade_words = Word.where(grade:grade)

    if (nwords < words_per_session) 
      grade_words.each do |word|
        if (!correct_words[word] && !today_words[word])
          today_words[word] = 1
          nwords += 1
        end
        break if (nwords >= words_per_session)
      end
    end

    if (nwords < words_per_session) 
      grade_words.each do |word|
        if (!today_words[word])
          today_words[word] = 1
          nwords += 1
        end
        break if (nwords >= words_per_session)
      end
    end

    @words = today_words.keys    
    @words = @words.find_all { |jword| jword.audio_types && jword.audio_types != "" }
    @stars = current_user.total_spell_stars
    @hangman_stars = current_user.total_hangman_stars
    render "spell"
  end

  def choose_school_class_week
    save_current_page("Inventure Words")
    @school = params[:school]
    school = School.find_by_name(@school)
    grades = school.grades.sort { |x, y| x.year <=> y.year }
    @grades_weeks = []
    grades.each do |g|
      grade_weeks = {}
      weeks = {}
      g.grade_week_words.each do |gww|
        weeks[gww.date_start_of_week] = 1
      end
      weeks = weeks.keys.sort.reverse
      grade_weeks[:grade] = g
      grade_weeks[:weeks] = weeks
      @grades_weeks << grade_weeks
    end
  end

  def spell_class_school_week
    save_current_page("Inventure Words")
    school = School.find_by_name(params[:school])
    grade = school.grades.find { |g| g.year == params[:grade].to_i }
    gwws = grade.grade_week_words
    if (params[:start_of_week])
      date = params[:start_of_week]
      year, month, day = date.split('-')
      start_of_week = Date.new(year.to_i, month.to_i, day.to_i)
      gwws = gwws.find_all { |gww| gww.date_start_of_week == start_of_week }
    end
    @words = gwws.collect { |gww| gww.word }
    # Do not consider words which do not have a pronounciation
    @words = @words.find_all { |jword| jword.audio_types && jword.audio_types != "" }
    @hangman_stars = current_user.total_hangman_stars
    @stars = current_user.total_spell_stars
    render "spell"
  end

  def draw_spell
    @hangman_stars = current_user.total_hangman_stars
    @stars = current_user.total_spell_stars
    render "_draw_spell", :layout => false
  end

  def spell_easy
    @words = Word.find_words(:minlength => 3,
                        :maxlength => 5,
                        :minrank => 1,
                        :maxrank => 300)
    render "spell"
  end

  def update_hangman_score
    jword = Word.find_by_word(params[:word])
    if jword
      score = params[:score]
      HangmanScore.create(:user => current_user,
                          :word => jword,
                          :score => score)
    end
    @hangman_stars = 0
    @stars = 0
    unless is_guest?
      @hangman_stars = current_user.total_hangman_stars
      @stars = current_user.total_spell_stars
    end
    render "home/update_hangman_score", :layout => false
  end

  def update_spell_score
    score = 0
    unless is_guest? 
      json = params[:json]
      score_table = JSON.parse(json)
      score = 0
      score_table.each do |word, word_score|
        score += word_score["score"].to_i
        jword = Word.find_by_word(word)
        next unless jword
        skipped = word_score["skipped"].to_i > 0 ? 1 : 0
        wrong = word_score["attempts"].to_i > 1 ? 1 : 0
        correct = (skipped == 0) && 
                  (wrong == 0) && 
                  (word_score["score"].to_i == 1) ? 1 : 0
        if ((correct != 0) || (skipped != 0) || (wrong != 0)) 
          word_score = WordScore.new(:word => jword,
                                     :user => current_user,
                                     :skipped => skipped,
                                     :bad_attempts => word_score["badAttempts"].join(','),
                                     :wrong => wrong,
                                     :correct => correct)
          word_score.save
        end
      end
    end
    session_score = SessionScore.new(:user => current_user, :score => score)
    session_score.save
    @hangman_stars = 0
    @stars = 0
    unless is_guest?
      @hangman_stars = current_user.total_hangman_stars
      @stars = current_user.total_spell_stars
    end
    render "home/update_spell_score", :layout => false
  end


  def get_meaning
    word = params[:word].downcase
    @full = params[:full] == "true"
    jword = Word.find_by_word(word)
    if (jword.meanings.size == 0) 
      jword.get_definitions
      jword = Word.find_by_word(word)
    end
    @definitions = jword.get_classified_definitions

    esentence = jword.example_sentences.size > 0 ? jword.example_sentences[0] : nil
    @sentence = nil
    @audio_file = nil
    if (esentence)
      @sentence = esentence.text.gsub!(word,"_______")
      @audio_file = "/assets/audios/examples/" + esentence.tatoeba_id.to_s + ".mp3" if esentence.has_audio && @full
    end
    render "home/get_meaning", :layout => false
  end

  def spell_medium
    @words = Word.find_words(:minlength => 4,
                        :maxlength => 6,
                        :minrank => 1,
                        :maxrank => 1000)
    render "spell"
  end

  def spell_hard
    @words = Word.find_words(:minlength => 5,
                        :maxlength => 20,
                        :minrank => 200,
                        :maxrank => 10000)
    render "spell"
  end

  def update_spell_scores
  end

  def score_history
    save_current_page("History")
    min_date = Date.today
    max_date = Date.today - 365
    session_scores = current_user.session_scores
    session_scores.each do |ss|
      min_date = min_date < ss.created_at.to_date ? min_date : ss.created_at.to_date
      max_date = max_date > ss.created_at.to_date ? max_date : ss.created_at.to_date
    end
    @score_table = []
    session_scores_index = 0
    min_date.upto max_date do |d|
      score_that_day = 0
      while ((session_scores_index < session_scores.size) &&
             (session_scores[session_scores_index].created_at.to_date == d))
        score_that_day += session_scores[session_scores_index].score
        session_scores_index += 1
      end
      table_entry = ["#{d.day}/#{d.month}/#{d.year}", score_that_day]
      @score_table << table_entry
    end
    @score_table = @score_table.to_json
  end

  def sahil
    render "home/sahil", :layout => false
  end

  def aadi
    render "home/aadi", :layout => false
  end

  def draw_hangman
    @hangman_stars = current_user.total_hangman_stars
    @stars = current_user.total_spell_stars
    render "home/hangman", :layout => false
  end

  def draw_shoot_and_spell
    render "home/draw_shoot_and_spell", :layout => false
  end

  def shoot_words
    @words = Word.all.shuffle[0..99].sort { |a, b| a.word.size <=> b.word.size }
  end

  def login_oid
    logger.info(params)
  end

end
