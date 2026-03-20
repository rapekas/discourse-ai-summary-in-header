# frozen_string_literal: true

RSpec.describe "AI Summary in topic header theme" do
  let!(:theme) { upload_theme_component }

  let(:topic) { Fabricate(:topic) }

  it "renders the topic title wrapper the theme targets" do
    visit("/t/#{topic.slug}/#{topic.id}")

    expect(page).to have_css("#topic-title .title-wrapper h1")
  end
end
