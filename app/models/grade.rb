class Grade < ActiveRecord::Base
  belongs_to :school
  has_many   :grade_week_words

  def Grade.get_array_for_select
    grade_array = []
    1.upto 9 do |i| 
      grade_array << [i, i]
    end 
    grade_array
  end

  def Grade.get_default_grade
    1
  end
end
