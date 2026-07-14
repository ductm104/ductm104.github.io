source "https://rubygems.org"
# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
# gem "jekyll", "~> 4.0.0"
# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem "minima", "~> 2.5"
# The github-pages meta-gem cannot run on Ruby >= 4.0 (its commonmarker
# dependency caps Ruby at < 4.0), so for local dev we use jekyll directly,
# matching the version GitHub Pages runs in production. The deployed site
# is still built by GitHub with its own gem set.
gem "jekyll", "~> 3.10"
gem "kramdown-parser-gfm"
gem "kramdown-math-katex"
# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem 'jekyll-octicons'
end

gem "jekyll-github-metadata"

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :install_if => Gem.win_platform?

# stdlib gems removed from newer Rubies that jekyll 3.x still requires
gem "webrick"
gem "csv"
gem "base64"
gem "bigdecimal"

