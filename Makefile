SHELL := bash -O globstar

files := index.html
files += style.css
files += countdown.js

all: pretty lint

pretty:
	prettier -w --print-width 120 *.js
	tidy -i -q -w 110 -m *.html

lint:
	npx eslint *.js

clean:
	rm **/*~

publish:
	./publish.sh $(files)
