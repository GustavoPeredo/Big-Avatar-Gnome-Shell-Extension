SHELL = bash
# get UUID from metadata
UUID = $(shell grep -E '^[ ]*"uuid":' ./metadata.json | sed 's@^[ ]*"uuid":[ ]*"\(.\+\)",[ ]*@\1@')

# if no XDG_DATA_HOME, set it
ifeq ($(XDG_DATA_HOME),)
XDG_DATA_HOME = $(HOME)/.local/share
endif

INSTALLBASE = $(XDG_DATA_HOME)/gnome-shell/extensions

install:
	rm -rfv $(INSTALLBASE)/$(UUID)
	mkdir -v $(INSTALLBASE)/$(UUID)
	cp -rv ./* $(INSTALLBASE)/$(UUID)
