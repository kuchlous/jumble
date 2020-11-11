require 'spec_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.

describe GradeWeekWordsController do

  # This should return the minimal set of attributes required to create a valid
  # GradeWeekWord. As you add validations to GradeWeekWord, be sure to
  # update the return value of this method accordingly.
  def valid_attributes
    {}
  end
  
  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # GradeWeekWordsController. Be sure to keep this updated too.
  def valid_session
    {}
  end

  describe "GET index" do
    it "assigns all grade_week_words as @grade_week_words" do
      grade_week_word = GradeWeekWord.create! valid_attributes
      get :index, {}, valid_session
      assigns(:grade_week_words).should eq([grade_week_word])
    end
  end

  describe "GET show" do
    it "assigns the requested grade_week_word as @grade_week_word" do
      grade_week_word = GradeWeekWord.create! valid_attributes
      get :show, {:id => grade_week_word.to_param}, valid_session
      assigns(:grade_week_word).should eq(grade_week_word)
    end
  end

  describe "GET new" do
    it "assigns a new grade_week_word as @grade_week_word" do
      get :new, {}, valid_session
      assigns(:grade_week_word).should be_a_new(GradeWeekWord)
    end
  end

  describe "GET edit" do
    it "assigns the requested grade_week_word as @grade_week_word" do
      grade_week_word = GradeWeekWord.create! valid_attributes
      get :edit, {:id => grade_week_word.to_param}, valid_session
      assigns(:grade_week_word).should eq(grade_week_word)
    end
  end

  describe "POST create" do
    describe "with valid params" do
      it "creates a new GradeWeekWord" do
        expect {
          post :create, {:grade_week_word => valid_attributes}, valid_session
        }.to change(GradeWeekWord, :count).by(1)
      end

      it "assigns a newly created grade_week_word as @grade_week_word" do
        post :create, {:grade_week_word => valid_attributes}, valid_session
        assigns(:grade_week_word).should be_a(GradeWeekWord)
        assigns(:grade_week_word).should be_persisted
      end

      it "redirects to the created grade_week_word" do
        post :create, {:grade_week_word => valid_attributes}, valid_session
        response.should redirect_to(GradeWeekWord.last)
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved grade_week_word as @grade_week_word" do
        # Trigger the behavior that occurs when invalid params are submitted
        GradeWeekWord.any_instance.stub(:save).and_return(false)
        post :create, {:grade_week_word => {}}, valid_session
        assigns(:grade_week_word).should be_a_new(GradeWeekWord)
      end

      it "re-renders the 'new' template" do
        # Trigger the behavior that occurs when invalid params are submitted
        GradeWeekWord.any_instance.stub(:save).and_return(false)
        post :create, {:grade_week_word => {}}, valid_session
        response.should render_template("new")
      end
    end
  end

  describe "PUT update" do
    describe "with valid params" do
      it "updates the requested grade_week_word" do
        grade_week_word = GradeWeekWord.create! valid_attributes
        # Assuming there are no other grade_week_words in the database, this
        # specifies that the GradeWeekWord created on the previous line
        # receives the :update_attributes message with whatever params are
        # submitted in the request.
        GradeWeekWord.any_instance.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, {:id => grade_week_word.to_param, :grade_week_word => {'these' => 'params'}}, valid_session
      end

      it "assigns the requested grade_week_word as @grade_week_word" do
        grade_week_word = GradeWeekWord.create! valid_attributes
        put :update, {:id => grade_week_word.to_param, :grade_week_word => valid_attributes}, valid_session
        assigns(:grade_week_word).should eq(grade_week_word)
      end

      it "redirects to the grade_week_word" do
        grade_week_word = GradeWeekWord.create! valid_attributes
        put :update, {:id => grade_week_word.to_param, :grade_week_word => valid_attributes}, valid_session
        response.should redirect_to(grade_week_word)
      end
    end

    describe "with invalid params" do
      it "assigns the grade_week_word as @grade_week_word" do
        grade_week_word = GradeWeekWord.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        GradeWeekWord.any_instance.stub(:save).and_return(false)
        put :update, {:id => grade_week_word.to_param, :grade_week_word => {}}, valid_session
        assigns(:grade_week_word).should eq(grade_week_word)
      end

      it "re-renders the 'edit' template" do
        grade_week_word = GradeWeekWord.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        GradeWeekWord.any_instance.stub(:save).and_return(false)
        put :update, {:id => grade_week_word.to_param, :grade_week_word => {}}, valid_session
        response.should render_template("edit")
      end
    end
  end

  describe "DELETE destroy" do
    it "destroys the requested grade_week_word" do
      grade_week_word = GradeWeekWord.create! valid_attributes
      expect {
        delete :destroy, {:id => grade_week_word.to_param}, valid_session
      }.to change(GradeWeekWord, :count).by(-1)
    end

    it "redirects to the grade_week_words list" do
      grade_week_word = GradeWeekWord.create! valid_attributes
      delete :destroy, {:id => grade_week_word.to_param}, valid_session
      response.should redirect_to(grade_week_words_url)
    end
  end

end