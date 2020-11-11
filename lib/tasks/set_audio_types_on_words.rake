namespace :db do
  desc 'Set the audio types on words based on what is there in directories'
  task :set_audio_types_on_words, :filename do |t, args|
    Rake::Task["environment"].invoke
    Word.all.each do |jword|
      word = jword.word
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

