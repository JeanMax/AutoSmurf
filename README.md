# AutoSmurf
Here a script which try to level and rush your characters, starting from nothing.
It should works with any class, assuming you've got at least one sorc in the team to teleport (smurfette) and one barb to bo (bigSmurf).
It's made to be use *with* AutoBuild

### Instructions:
* Add something like this in your character config file:

```
    //NOTE: Use PROFILE names (= window title), NOT character names
    Scripts.AutoSmurf = true;
        Config.AutoSmurf.Smurfette = "etteA";
            //sorc profile name, will teleport (required)
        Config.AutoSmurf.BigSmurf = "bsA";
            //barb profile name, will lead/bo (required)
        Config.AutoSmurf.Smurfs = ["sorcA", "palaA"];
            //the other smurfs (optional)

    Config.QuitList = ["BigSmurfA", "SmurfetteA", "SmurfSorcA", "SmurfPalaA"];
        //List of character names to quit with.

    Config.AutoBuild.Enabled = true;
    Config.AutoBuild.Template = "SmurfBuild";
        //add your own! it would be nice to have teleport/bo as soon as possible
```

* This should go somewhere in *d2bs/kolbot/libs/common/Config.js*:

```
    AutoSmurf: {
        Smurfette: "",
        BigSmurf: "",
        Smurfs: []
    },
```

* Oh, and save *AutoSmurf.js* in *d2bs/kolbot/libs/bots/* of course :D

### You said Custom?
> On the top of AutoSmurf.js, you'll find a 'SmurfConfig' object... I think it's pretty self explanatory, you'll figure it out.  
> Just after that, there's a character config override. It aims at making your autobuild easier! You can edit/comment it without risking to break anything.


### Licence:
**Beerware, Hell Yeah!**

 *Happy Smurfing!*