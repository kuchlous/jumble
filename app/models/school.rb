class School < ActiveRecord::Base
  has_many :grades

  def School.get_array_for_select
    school_array = School.all
    school_array.collect { |s| [s.name, s.id] }
  end

  def School.get_default_school
    School.all[0].id
  end

end
