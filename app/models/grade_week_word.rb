class GradeWeekWord < ActiveRecord::Base
  belongs_to :grade
  belongs_to :word
end
