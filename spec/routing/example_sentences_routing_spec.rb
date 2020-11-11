require "spec_helper"

describe ExampleSentencesController do
  describe "routing" do

    it "routes to #index" do
      get("/example_sentences").should route_to("example_sentences#index")
    end

    it "routes to #new" do
      get("/example_sentences/new").should route_to("example_sentences#new")
    end

    it "routes to #show" do
      get("/example_sentences/1").should route_to("example_sentences#show", :id => "1")
    end

    it "routes to #edit" do
      get("/example_sentences/1/edit").should route_to("example_sentences#edit", :id => "1")
    end

    it "routes to #create" do
      post("/example_sentences").should route_to("example_sentences#create")
    end

    it "routes to #update" do
      put("/example_sentences/1").should route_to("example_sentences#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/example_sentences/1").should route_to("example_sentences#destroy", :id => "1")
    end

  end
end
