erl -pa . -pz ebin -make && \
    sudo cp ebin/mod_offline_post.beam /usr/lib64/ejabberd/ebin/ && \
    echo 'install completed'

