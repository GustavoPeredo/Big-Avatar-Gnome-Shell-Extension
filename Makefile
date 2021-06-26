UUID = $(shell grep -E '^[ ]*"uuid":' ./metadata.json | sed 's@^[ ]*"uuid":[ ]*"\(.\+\)",[ ]*@\1@')

ifeq ($(XDG_DATA_HOME),)
XDG_DATA_HOME = $(HOME)/.local/share
endif

INSTALLBASE = $(XDG_DATA_HOME)/gnome-shell/extensions

INSTALLNAME = $(UUID)

install:
	rm -rf $(INSTALLBASE)/$(INSTALLNAME)
	mkdir $(INSTALLBASE)/$(INSTALLNAME)
	cp -r ./* $(INSTALLBASE)/$(INSTALLNAME)/

restart-shell:
	echo "Restart shell!"
	if bash -c 'xprop -root &> /dev/null'; then \
		busctl --user call org.gnome.Shell /org/gnome/Shell org.gnome.Shell Eval s 'Meta.restart("Restarting Gnome...")'; \
	else \
		gnome-session-quit --logout; \
	fi
	sleep 3
