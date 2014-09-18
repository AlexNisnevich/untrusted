# collecting jsx filenames in a directory and write them to $target.
target=$1
mod=$2
[ -z $mod ] && mod=default

levels=''

for lvl in mods/$mod/*.jsx
do
	lvl=`basename $lvl`
	levels=`printf "$levels'%s'," $lvl`
done

levels="${levels%?}"

sed -i "s#\/\/%LEVELS%#$levels#g" $target

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
