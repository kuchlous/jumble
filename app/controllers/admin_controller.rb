class AdminController < ApplicationController
  def index
    render "index", :layout => false 
  end

  def create_date_table(records, is_cummulative)

    records.sort! { |x, y| x.created_at <=> y.created_at }
    min_date = records[0].created_at.to_date
    max_date = Date.today

    gindex = 0
    nsum = 0
    gtable = []
    min_date.upto max_date do |d|
      nsum = 0 unless is_cummulative
      while ((gindex < records.size) &&
             (records[gindex].created_at.to_date == d))
        nsum += 1
        gindex += 1
      end
      table_entry = ["#{d.day}/#{d.month}/#{d.year}", nsum]
      gtable << table_entry
    end
    gtable
  end

  def create_active_user_table
    records = SessionScore.all.sort {|x, y| x.created_at <=> y.created_at }
    min_date = records[0].created_at.to_date
    max_date = records.last.created_at.to_date

    gindex = 0
    nsum = 0
    gtable = {}
    min_date.upto max_date do |d|
      nsum = 0 
      users_seen = {}
      while ((gindex < records.size) &&
             (records[gindex].created_at.to_date == d))
        if (!users_seen[records[gindex].user])
          users_seen[records[gindex].user] = true
          nsum += 1
        end
        gindex += 1
      end
      gtable["#{d.day}/#{d.month}/#{d.year}"] = nsum
    end
    gtable
  end

  def user_stats
    user_table = create_date_table(User.all, true)
    active_user_table = create_active_user_table
    @user_table = user_table.collect { |entry| 
      entry << (active_user_table[entry[0]] ? active_user_table[entry[0]] : 0)
    }
    @sessions_table = create_date_table(SessionScore.all, false)
  end

  def choose_meanings
    @words = Word.all.find_all { |w| 
      w.meanings.find_all { |m| 
        m.is_preferred }.size == 0
    }
    @words = @words[0..99]
  end

  def get_meanings_for_selection
    word = params[:word]
    jword = Word.find_by_word(word)
    if (jword.meanings.size == 0) 
      jword.get_definitions
      jword = Word.find_by_word(word)
    end
    @word = jword
    @definitions = jword.meanings
    render "get_meanings_for_selection", :layout => false
  end

  def choose_meaning
    jword = Word.find(params[:word_id].to_i)
    definition = Meaning.find(params[:meaning_id].to_i)
    definition.is_preferred = true
    definition.save
    render :nothing => true
  end

  def set_new_meaning
    jword = Word.find_by_word(params[:word])
    meaning = params[:meaning]
    gtype = params[:gtype]
    Meaning.create(:word=>jword, :meaning => meaning, :gtype => gtype, :is_preferred => true)
    render :nothing => true
  end
end
