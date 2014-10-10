# collecting jsx filenames in a directory and write them to $target.
target=$1
mod=$2

# MOD
sed -i "s#\/\/%MOD%#$mod#" $target

[ -z $mod ] && mod=default

# LEVELS
levels=''
for lvl in mods/$mod/*.jsx
do
	lvl=`basename $lvl`
	levels=`printf "$levels'%s'," $lvl`
done
levels="${levels%?}"
sed -i "s#\/\/%LEVELS%#$levels#g" $target

# BONUS
bonus=''
if [ -d mods/$mod/bonus ]; then
	for lvl in mods/$mod/bonus/*.jsx
	do
		lvl=`basename $lvl`
		bonus=`printf "$bonus'%s'," $lvl`
	done
fi
bonus="${bonus%?}"
sed -i "s#\/\/%BONUS%#$bonus#" $target

# INTRO
f=mods/default/intro.jsi
[ -f mods/$mod/intro.jsi ] && f=mods/$mod/intro.jsi
IFS="
"
for l in `cat $f`; do
	l=`echo $l|sed "s|#|\\\\\#|"`
	sed -i "s#\/\/%INTRO%#$l\n\/\/%INTRO%#" $target
done
