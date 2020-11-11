namespace :db do
  def save_words
      Word.all.each do |jword| 
        if (!jword.audio_types || jword.audio_types == '')
          word = jword.word
          success = jword.get_audio(1)
          success = jword.get_audio(2)

          filename_american = Rails.root.to_s + "/public/assets/audios/#{word}_american.mp3"
          filename_british = Rails.root.to_s + "/public/assets/audios/#{word}_british.mp3"
          filetype_american = `file #{filename_american}`
          filetype_british = `file #{filename_british}`

          types = []
          if (/MPEG/.match(filetype_american))
            types << "american"
          end
          if (/MPEG/.match(filetype_british))
            types << "british"
          end
          puts "#{jword.word} : #{types.join(",")}"
          jword.audio_types = types.join(",")
          jword.save
        end
      end
  end

  task :set_audio_for_all_words, :filename do |t, args|
    Rake::Task["environment"].invoke
    save_words
  end
end
