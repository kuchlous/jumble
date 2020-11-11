class CreateGradeWeekWords < ActiveRecord::Migration[5.2]
  def change
    create_table :grade_week_words do |t|
      t.references :grade
      t.references :word
      t.date       :date_start_of_week
      t.timestamps
    end
  end
end
