class Word < ActiveRecord::Base

  has_many :word_scores
  has_many :meanings
  has_and_belongs_to_many :example_sentences 
  has_many :grade_week_words

  # has_many :word_example_sentences

  def get_audio(source)
    # response = HTTParty.get("http://translate.google.com/translate_tts?tl=en&q=#{self.word}")
    response = nil
    suffix = ""
    if (source == 1)
      suffix = "_american";
      logger.info("Trying to get word from https://ssl.gstatic.com/dictionary/static/sounds/de/0/#{self.word}")
      response = HTTParty.get("https://ssl.gstatic.com/dictionary/static/sounds/de/0/#{self.word}.mp3")
    else 
      suffix = "_british";
      logger.info("Trying to get word from http://www.howjsay.com/mp3/#{self.word}.mp3")
      response = HTTParty.get("http://www.howjsay.com/mp3/#{self.word}.mp3")
    end
    # wav file
    # response = HTTParty.get("http://www.cooldictionary.com/say.mpl?phrase=#{word}&voice=male&q=aa.wav")

    if (response.body) 
      f = File.new(::Rails.root.to_s + "/public/assets/audios/#{self.word}#{suffix}.mp3", "wb")
      f.write(response.body)
      f.close
      return true
    else
      self.errors << "Word does not exist"
      return false
    end
  end

  def Word.find_words(args)
    minlength = args[:minlength] ? args[:minlength] : 2
    maxlength = args[:maxlength] ? args[:maxlength] : 20
    minrank = args[:minrank] ? args[:minrank] : 1
    maxrank = args[:maxrank] ? args[:maxrank] : 1000000

    words = Word.all.find_all { |word|
              word.word.size >= minlength &&
              word.word.size <= maxlength &&
              word.pop_rank >= minrank &&
              word.pop_rank <= maxrank
    }
  end

  def mistakes
    mistakes = []
    mistakes += self.word_scores.find_all { |ws| ws.bad_attempts != "" }.collect { |ws| ws.bad_attempts }.join(',').split(',')
    if (self.misspellings)
      mistakes += self.misspellings.split(',')
    end
    if (self.homophone)
      mistakes += self.homophone.split(',')
    end

    mistakes.uniq!

    mistakes
  end

  ORDER_HASH = {"verb" => 0, "noun" => 1, "adjective" => 2, "adverb" => 3}

  def get_classified_definitions
    definitions = []
    meanings = self.meanings
    logger.info(meanings.size.to_s)
    def_hash = {}
    meanings.each do |meaning|
      def_hash[meaning.gtype] ||= []
      def_hash[meaning.gtype] << meaning.meaning
    end

    def_hash.each do |key, ndefinitions|
      def_category = {}
      def_category[:def_type] = key
      def_category[:definitions] = ndefinitions
      definitions << def_category
    end

    definitions = definitions.sort { |x, y| ORDER_HASH[x[:def_type]] <=> ORDER_HASH[y[:def_type]] }

    definitions
  end

  def get_definitions
    definitions = []
    DictClient.new("all.dict.org").connect() do |dc|
      definitions = dc.define(self.word, "wn")
      dc.disconnect()
    end

    return if definitions.size == 0

    def_categories = []

    # split individual definitions into separate lines
    definitions[0][1..-1].each do |l|
      if /(n|v|adv|adj) \d+:(.*)/.match(l)
        # new category
        def_type = $1
        def_type = ($1 == 'n') ? "noun" :
                   ($1 == 'v') ? "verb" :
                   ($1 == 'adv') ? "adverb" :
                   ($1 == 'adj') ? "adjective" :
                   ""
        def_category = {}
        def_category[:def_type] = def_type
        def_category[:definitions] = [$2]
        def_categories << def_category
      elsif /\d+:(.*)/.match(l)
        # new definition
        def_categories[def_categories.size - 1][:definitions] << $1
      else
        # new line
        current_definitions = def_categories[def_categories.size - 1][:definitions]
        current_definitions[current_definitions.size - 1] += l.chomp
      end
    end
   
    def_categories.each do |def_category|
      # merge spaces
      def_category[:definitions].collect! { |x| x.gsub(/\s+/,' ') }
      def_category[:definitions].collect! { |x| x.gsub(/;.*$/,'').gsub(/\[.*$/,'')}
      def_category[:definitions] = def_category[:definitions].find_all { |x| !x.include?(self.word) }
      def_category[:definitions] = def_category[:definitions].find_all { |x| !x.include?("sex") }
    end

    def_categories.each do |def_category|
      def_category[:definitions].each do |onedef|
        meaning = Meaning.create(:gtype => def_category[:def_type], :meaning => onedef, :word => self)
      end
    end

    # .gsub(/\[.*$/,'').gsub(/2:.*/,'').gsub(/^.*1: /, '')
    # @synonyms = definitions[0].seeAlso
    # @synonyms = @synonyms - [word]

  end

end
