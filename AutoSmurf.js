/**
*   @filename   AutoSmurf.js
*   @author     JeanMax
*   @desc       Questing, Leveling & Smurfing
*/

/******************************************************************************/
/* "THE BEER-WARE LICENSE" (Revision 42):                                     */
/*   Alogwe, Imba, JeanMax, Kolton, Larryw, Noah, QQValpen, Sam and YGM       */
/*   contributed to this file. As long as you retain this notice you can do   */
/*   whatever you want with this stuff. If we meet some day, and you think    */
/*   this stuff is worth it, you can buy us a beer in return.                 */
/*                           <#d2bs@irc.synirc.org>                           */
/******************************************************************************/

"use strict";
js_strict(true);

//will keep doing these xp spots till the specified levels are reached
// [normal, nightmare, hell]
var SmurfConfig = {
    caveLvl: [5, -1, -1],
    tristLvl: [14, -1, -1],
    tombsLvl: [22, -1, -1],
    diaLvl: [24, 40, 60],
    walkBaalLvl: [28, -1, -1],
    killBaal: true
};

//char config override
Config.MinGameTime = 3 * 60;
Config.MaxGameTime = (((!me.gametype && me.getQuest(26, 0))
                        || me.getQuest(40, 0)) ? 7 : 20) * 60;
me.maxgametime = Config.MaxGameTime * 1000;
Config.OpenChests = 2;
Config.PickRange = 30;
Config.LowGold = me.charlvl * 1000;
Config.StashGold = Config.LowGold / 2;
Config.UseMerc = !!me.gametype && (!!me.getQuest(2, 0) || !!me.diff);
Config.Cubing = !!me.getItem(549) || !!me.diff;
Config.FindItem = !!me.getSkill(142, 1);
Config.Vigor = !!me.getSkill(115, 1);
Config.Redemption = me.getSkill(124, 1) ? [0, 0] : [50, 50];
Config.CastStatic = 17 * (me.gametype * me.diff + 1);
Config.StaticList = ["Griswold", "Andariel", "Duriel", "Toorc Icefist",
                     "Ismail Vilehand", "Geleb Flamefinger", "Mephisto",
                     "Izual", "Diablo", "Korlic", "Madawc", "Talic",
                     "Lister the Tormentor", "Baal"];
//Config.ClearType is handled later on the script


// No touchy!
var Msg = {action: "", x: 0, y: 0, area: 0, timer: getTickCount()};

var Team = {
    size: 2 + Config.AutoSmurf.Smurfs.length,
    type: {all: (1 | 2 | 4), smurfette: 1, bigSmurf: 2, smurf: 4},
    myType: 4,
    names: [],

    init: function () {
        print("init");

        this.start = function () {

            this.handleQuestItem = function () {
                var item;

                //searching for: vip amu, akara scroll (1 or 2)
                item = me.getItem(521) || me.getItem(524) || me.getItem(525);
                if (item) {
                    if (item.location !== 7 && Storage.Stash.CanFit(item)) {
                        Storage.Stash.MoveTo(item);
                        delay(me.ping * 2 + 100);
                        me.cancel();
                        delay(me.ping * 2 + 100);
                    }
                }
                //searching for: rada book, malah scroll
                item = me.getItem(552) || me.getItem(646);
                if (item) {
                    if (!Town.openStash()) {
                        Town.move("stash");
                        Town.openStash();
                    }
                    delay(me.ping * 2 + 100);
                    clickItem(1, item);
                    delay(me.ping * 2 + 100);
                    me.cancel();
                }
            };

            var i = 42;

            if (me.windowtitle === Config.AutoSmurf.Smurfette) {
                this.myType = this.type.smurfette;
            } else if (me.windowtitle === Config.AutoSmurf.BigSmurf) {
                this.myType = this.type.bigSmurf;
            }

            Town.doChores();
            this.handleQuestItem();
            this.clickWP(false); //this is needed to init getWaypoint
            Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5));
            if (!this.sync(120, "start1")) {
                return false;
            }
            this.sendMsg(this.type.all); //init Team.names
            this.goToLastTown(); //after area sync for act3to4 workaround
            if (this.myType === this.type.bigSmurf) {
                for (i = 600; i && !this.inArea(); i -= 1) {
                    delay(100 + me.ping);
                }
            }

            return i && this.sync(60, "start2");
        };

        this.shareGold = function () {
            var i, item;

            if (me.getStat(14) + me.getStat(15) < Config.LowGold) {
                this.sendMsg(this.type.all, "askGold");
            }

            delay(me.ping + 200);
            this.sync(20, "shareGold1");
            if (Msg.action === "pickGold") {
                print("picking gold");
                Town.move("stash");
                for (i = 0; i < 40; i += 1) {
                    delay(500);
                    item = getUnit(4, 523, 3); //gold
                    if (item) {
                        Pickit.pickItem(item);
                    }
                }
                if (!Town.openStash()) {
                    Town.openStash();
                }
                gold(me.getStat(14), 3); //stashing gold
                delay(me.ping * 2 + 500);
                me.cancel();
            } else if (Msg.action === "dropGold") {
                print("droping gold");
                Town.move("stash");
                if (!Town.openStash()) {
                    Town.openStash();
                }
                gold(me.getStat(14), 3); //stashing gold
                delay(me.ping * 2 + 500);
                if (me.getStat(14) + me.getStat(15) > 2 * Config.LowGold) {
                    gold(Config.LowGold, 4); //unstashing gold
                    delay(me.ping * 4 + 500);
                    gold(me.getStat(14)); //droping gold
                    delay(me.ping * 4 + 500);
                }
                me.cancel();
                item = getUnit(4, 523, 3); //gold
                for (i = 0; i < 40 && item; i += 1) {
                    delay(500);
                    item = getUnit(4, 523, 3); //gold
                }
                if (item) {
                    Pickit.pickItem(item);
                }
            }

            Msg.action = "";

            return this.sync(60, "shareGold2");
        };

        this.shareWP = function () {
            var tpTome, wpGot, placeToBe,
                whereIwas = me.area;

            if (me.getQuest(13, 0) || me.diff) { //summoner
                return true;
            }

            switch (me.area) {
            case 1:
                if (getWaypoint(8)) { //CATACOMBS_LEVEL_2
                    wpGot = 8;
                } else if (getWaypoint(7)) { //INNER_CLOISTER
                    wpGot = 7;
                } else if (getWaypoint(6)) { //JAIL_LEVEL_1
                    wpGot = 6;
                } else if (getWaypoint(5)) { //OUTER_CLOISTER
                    wpGot = 5;
                } else if (getWaypoint(4)) { //BLACK_MARSH
                    wpGot = 4;
                } else if (getWaypoint(3)) { //DARK_WOOD
                    wpGot = 3;
                } else if (getWaypoint(2)) { //STONY_FIELD
                    wpGot = 2;
                } else if (getWaypoint(1)) { //COLD_PLAINS
                    wpGot = 1;
                } else {
                    wpGot = 0;
                }
                break;
            case 40:
                if (getWaypoint(16)) { //ARCANE_SANCTUARY
                    wpGot = 17;
                } else if (getWaypoint(15)) { //PALACE_CELLAR_LEVEL_1
                    wpGot = 16;
                } else if (getWaypoint(12)) { //HALLS_OF_THE_DEAD_LEVEL_2
                    wpGot = 15;
                } else if (getWaypoint(14)) { //LOST_CITY
                    wpGot = 14;
                } else if (getWaypoint(13)) { //FAR_OASIS
                    wpGot = 13;
                } else if (getWaypoint(11)) { //DRY_HILLS
                    wpGot = 11;
                } else {
                    wpGot = 0;
                }
                break;
            default:
                wpGot = 0;
            }

            Msg.area = 0;
            if (wpGot) {
                this.sendMsg(this.type.all, "WP:Got", wpGot);
            }
            delay(me.ping + 200);
            this.sync(60, "shareWP1");
            if (Msg.area > wpGot) { //picking WP
                print("picking WP");
                this.sendMsg(this.type.all, "giveWP");
            }
            delay(me.ping + 200);
            this.sync(20, "shareWP2");
            switch (Msg.area) {
            case 1:
                placeToBe = 3;
                break;
            case 2:
                placeToBe = 4;
                break;
            case 3:
                placeToBe = 5;
                break;
            case 4:
                placeToBe = 6;
                break;
            case 5:
                placeToBe = 27;
                break;
            case 6:
                placeToBe = 29;
                break;
            case 7:
                placeToBe = 32;
                break;
            case 8:
                placeToBe = 35;
                break;
            case 11:
                placeToBe = 42;
                break;
            case 13:
                placeToBe = 43;
                break;
            case 14:
                placeToBe = 44;
                break;
            case 15:
                placeToBe = 57;
                break;
            case 16:
                placeToBe = 52;
                break;
            case 17:
                placeToBe = 74;
                break;
            case 21:
                placeToBe = 78;
                break;
            case 22:
                placeToBe = 79;
                break;
            case 23:
                placeToBe = 80;
                break;
            case 24:
                placeToBe = 81;
                break;
            case 25:
                placeToBe = 83;
                break;
            case 26:
                placeToBe = 101;
                break;
            }
            if (Msg.action === "giveWP" && wpGot && Msg.area === wpGot) {
                print("giving WP");
                Town.move("waypoint");
                Pather.useWaypoint(placeToBe);
                tpTome = me.findItem("tbk", 0, 3);
                if (tpTome && tpTome.getStat(70) > 0) {
                    Pather.makePortal();
                }
                delay(500);
                this.sendMsg(this.type.all, "come"); //humph
                delay(5000);
                Pather.useWaypoint(whereIwas);
                Town.goToTown();
            } else if (Msg.area > wpGot && this.waitTP(placeToBe)) {
                print("picking WP");
                this.clickWP(false);
                Pather.useWaypoint(whereIwas);
                Town.goToTown();
            }
            Msg.area = 0;
            Msg.action = "";

            return this.sync(60, "shareWP3");
        };

        this.bo = function () {
            this.goToBo = function () {
                var i,
                    pathX = [5106, 5205, 5205, 5214, 5222],
                    pathY = [5125, 5125, 5152, 5153, 5181];

                if (!Pather.accessToAct(2)) {
                    Town.goToTown(1);
                    while (me.area !== 2) {
                        Town.move("portalspot");
                        try {
                            Pather.moveToExit(2, true);
                        } catch (e1) {
                            print(e1);
                            Packet.flash(me.gid);
                            delay(me.ping * 2 + 100);
                            Town.goToTown(1);
                        }
                        Packet.flash(me.gid);
                        delay(me.ping * 2 + 100);
                    }

                } else {
                    if (getWaypoint(10)) {
                        Pather.useWaypoint(48, true);
                    } else {
                        Town.goToTown(2);
                        if (this.myType === this.type.smurfette) {
                            Config.ClearType = false;
                            Pather.teleport = true;
                            while (me.area !== 48) {
                                if (me.area === 47) {
                                    try {
                                        Pather.moveToExit(48, true);
                                    } catch (e2) {
                                        print(e2);
                                        Town.goToTown(2);
                                    }
                                } else if (me.area === 40) {
                                    for (i = 0; i < pathX.length; i += 1) {
                                        Pather.moveTo(pathX[i], pathY[i]);
                                        Packet.flash(me.gid);
                                        delay(me.ping * 2 + 100);
                                    }
                                    try {
                                        Pather.moveToExit(47, true);
                                    } catch (e3) {
                                        print(e3);
                                        Town.goToTown(2);
                                    }
                                }
                                Packet.flash(me.gid);
                                delay(me.ping * 2 + 100);
                            }
                        } else if (!this.waitTP(48)) {
                            return false;
                        }
                        this.clickWP(false);
                    }
                    Pather.moveTo(me.x + 4, me.y + 4);
                }
                delay(me.ping * 2 + 500);
                if (this.myType === this.type.smurfette) {
                    delay(me.ping * 2 + 500);
                    if (!this.inArea()) {
                        Pather.makePortal();
                        Pather.moveTo(me.x + 2, me.y + 2);
                        this.sendMsg(this.type.bigSmurf | this.type.smurf,
                                        "come");
                    }
                }

                for (i = 150; i && !this.inArea(); i -= 1) {
                    delay(100);
                }

                return !!i;
            };

            this.comeBack = function (there) {
                if (!Pather.accessToAct(2)) {
                    if (!Pather.moveToExit(1, true)) {
                        Town.goToTown();
                    }
                    Town.move("waypoint");
                } else {
                    Pather.useWaypoint(there);
                }
                this.goToLastTown();
            };

            this.beBo = function () {
                var i;

                for (i = 30; i && !me.getState(32); i -= 1) {
                    delay(100);
                }
                delay(500 + me.ping * 2);
            };

            var preArea = me.area;

            if (!this.isLevel(24)) {
                return true;
            }
            this.announce("bo");

            if (!this.goToBo()) {
                return false;
            }
            if (this.myType === this.type.bigSmurf) {
                Precast.doPrecast(true);
            } else {
                this.beBo();
            }
            this.comeBack(preArea);

            return this.sync(60, "bo");
        };

        this.brokeCheck = function () {
            var tpTome = me.findItem("tbk", 0, 3);

            if (!this.isLevel(15)) {
                return true;
            }

            if (!tpTome || !tpTome.getStat(70)
                    || me.getStat(14) + me.getStat(15) < Config.LowGold / 10) {
                this.sendMsg(this.type.all, "broken");
                Msg.action = "broken";
                print("I'm broken :/");
                D2Bot.printToConsole("AutoSmurf: I'm broken :/ ("
                    + (me.getStat(14) + me.getStat(15)) + "$murfs)");
            }
            delay(me.ping + 200);

            return this.sync(60, "brokeCheck");
        };

        var f = ["start", "shareGold", "shareWP", "bo", "brokeCheck"];

        while (f.length) {
            if (!this[f[0]]()) {
                print(f[0] + " failed");
                D2Bot.printToConsole("AutoSmurf: " + f[0] + " failed");
                return false;
            }
            f.shift();
        }

        return true;
    },

    sendMsg: function (teamType, action, x, y, area) {
        var i;

        this.sendTo = function (mode, msg) {
            if ((teamType & this.type.smurfette) !== 0) {
                sendCopyData(null, Config.AutoSmurf.Smurfette, mode, msg);
            }
            if ((teamType & this.type.bigSmurf) !== 0) {
                sendCopyData(null, Config.AutoSmurf.BigSmurf, mode, msg);
            }
            if ((teamType & this.type.smurf) !== 0) {
                for (i = this.size - 3; i >= 0; i -= 1) {
                    sendCopyData(null, Config.AutoSmurf.Smurfs[i], mode, msg);
                }
            }

            return true;
        };

        if (x && y && area) { //updating coords (Util.startFollow)
            this.sendTo(101, x.toString());
            this.sendTo(102, y.toString());
            this.sendTo(103, area.toString());
        } else if (x) {        //wp id (wpSharing)
            this.sendTo(104, x.toString());
        } else if (action) {   //a string to save
            this.sendTo(100, action);
        } else {              //init Team.names
            switch (this.myType) {
            case this.type.bigSmurf:
                this.sendTo(105, "*" + me.name);
                break;
            case this.type.smurfette:
                this.sendTo(105, "$" + me.name);
                break;
            default:
                this.sendTo(105, me.name);
            }
        }
    },

    sync: function (timeout, seed) {
        print("sync");
        var save;

        if (!seed) {
            seed = "seed";
        }
        if (!timeout) {
            timeout = 60;
        }
        timeout *= 20;

        delay(200);
        if (this.myType === this.type.bigSmurf) {
            save = Msg.x;
            Msg.x = 0;
            while (timeout && Msg.x !== this.size - 1) {
                if (Msg.x > this.size) {
                    save = Msg.x;
                }
                Msg.x = 0;
                this.sendMsg(this.type.smurfette | this.type.smurf, "ping");
                delay(50);
                timeout -= 1;
                while (timeout && Msg.x !== this.size - 1 && timeout % 20) {
                    delay(50);
                    timeout -= 1;
                }
            }
            Msg.x = save;
            if (timeout) {
                this.sendMsg(this.type.smurfette | this.type.smurf, seed);
            }

        } else {
            save = Msg.action;
            Msg.y = 1; //ready to pong
            while (timeout && Msg.action !== seed) {
                delay(50);
                timeout -= 1;
                if (Msg.action && Msg.action !== seed) {
                    save = Msg.action;
                }
            }
            Msg.y = 0;
            Msg.action = save === seed ? "" : save;
        }
        delay(200);

        return !!timeout;
    },

    clickWP: function (wait) {
        print("clickWP");
        //move to nearest wp and click it
        if (wait === undefined) {
            wait = true;
        }
        var i, j, k, wp, preset, preArea,
            tob = false,
            wpIDs = [119, 145, 156, 157, 237, 238, 288,
                    323, 324, 398, 402, 429, 494, 496, 511, 539];

        for (i = 0; i < wpIDs.length; i += 1) {
            preset = getPresetUnit(me.area, 2, wpIDs[i]);
            if (preset) {
                // print("going to nearest WP");
                try {
                    Pather.moveToUnit(preset, 0, 0, Config.ClearType);
                } catch (e) {
                    print(e);
                    preArea = me.area;
                    Town.goToTown();
                    Town.move("portalspot");
                    delay(10000);
                    this.sendMsg(this.type.smurfette | this.type.bigSmurf,
                                    "tp");
                    for (k = 0; k < 1000; k += 1) {
                        if (!Pather.usePortal(preArea, null)) {
                            delay(1000);
                        }
                        if (k > 60) {
                            return false;
                        }
                    }
                    Pather.moveToUnit(preset, 0, 0, Config.ClearType);
                }

                wp = getUnit(2, "waypoint");
                if (wp) {
                    if (!tob) {
                        if (this.myType === this.type.bigSmurf && wait) {
                            for (j = 0; j < 60 && !this.inArea(); j += 1) {
                                Attack.clear(20);
                                delay(500);
                            }
                            this.sendMsg(this.type.smurf, "wp");
                        }
                        tob = true;
                    }
                    for (j = 0; j < 10; j += 1) {
                        sendPacket(1, 0x13, 4, wp.type, 4, wp.gid);
                        delay(500);
                        if (getUIFlag(0x14)) {
                            delay(me.ping);
                            me.cancel();
                            tob = false;
                            break;
                        }
                        Packet.flash(me.gid);
                        delay(me.ping);
                        Pather.moveToUnit(preset, 0, 0,
                                            Config.ClearType);
                    }
                }
            }
        }

        return true;
    },

    waitTP: function (area, timeout) {
        print("waitTP");

        if (!area) {
            return false;
        }
        if (!timeout) {
            timeout = 180;
        }
        timeout *= 20;

        Town.goToTown();
        Town.move("portalspot");
        while (timeout && Msg.action !== "come") {
            delay(250);
            timeout -= 5;
        }
        Town.move("portalspot");
        Precast.doPrecast(true);
        while (timeout && !Pather.usePortal(area, null)) {
            delay(250);
            Town.move("portalspot");
            Packet.flash(me.gid);
            timeout -= 5;
        }
        while (timeout && !me.area) {
            delay(50);
            timeout -= 1;
        }

        return !!timeout && me.area === area;
    },

    changeAct: function (act) {
        print("change Act" + act);

        var npc, time, tpTome,
            preArea = me.area;

        if (me.act === act) {
            return true;
        }

        try {
            switch (act) {
            case 2:
                if (me.act >= 2) {
                    break;
                }
                Town.move("warriv");
                npc = getUnit(1, "warriv");
                sendPacket(1, 0x31, 4, npc.gid, 4, 183);
                delay(me.ping);
                sendPacket(1, 0x38, 4, 0, 4, npc.gid, 4, 0);
                delay(me.ping);
                break;
            case 3:
                if (me.act >= 3) {
                    break;
                }
                Town.move("palace");
                npc = getUnit(1, "jerhyn");
                if (!npc) {
                    print("jerhyn not found");
                    quit();
                }
                sendPacket(1, 0x31, 4, npc.gid, 4, 442);
                tpTome = me.findItem("tbk", 0, 3);
                if (tpTome && tpTome.getStat(70) > 0) {
                    try {
                        Pather.moveToExit(50, true);
                        if (!Pather.usePortal(40, null)) {
                            Town.goToTown();
                        }
                    } catch (e1) {
                        print(e1);
                    } finally {
                        Town.goToTown();
                    }
                }
                Town.move("meshif");
                npc = getUnit(1, "meshif");
                sendPacket(1, 0x31, 4, npc.gid, 4, 450);
                delay(me.ping * 2);
                sendPacket(1, 0x38, 4, 0, 4, npc.gid, 4, 0);
                delay(me.ping);
                break;
            case 4:
                if (me.act >= 4) {
                    break;
                }
                this.act3to4();
                break;
            case 5:
                if (me.act >= 5) {
                    break;
                }
                if (!me.gametype) {
                    return false;
                }
                Town.move("tyrael");
                npc = getUnit(1, "tyrael");
                sendPacket(1, 0x31, 4, npc.gid, 4, 20000);
                delay(me.ping);
                sendPacket(1, 0x38, 4, 0, 4, npc.gid, 4, 0);
                delay(me.ping);
                sendPacket(1, 0x40);
                delay(me.ping);
                break;
            }

            delay(1000 + me.ping * 2);
            while (!me.area) {
                delay(500);
            }

            if (me.area === preArea) {
                me.cancel();
                Town.move("portalspot");
                print("Act change failed.");
                return false;
            }
        } catch (e2) {
            print(e2);
            return false;
        }

        for (time = 0; time < 100 && !this.inArea(); time += 1) {
            if (time > 42) {
                quit();
            }
            delay(1000);
        }

        return true;
    }, //(<3 Kolton/Imba)

    act3to4: function () {
        print("act3to4");

        var time, cain;

        Pather.teleport = true;
        if (this.myType === this.type.smurfette) {
            Pather.useWaypoint(101, true);
            Precast.doPrecast(true);
            try {
                Pather.moveToExit(102, true);
                Pather.moveTo(17601, 8070);
                Pather.makePortal();
                this.sendMsg(this.type.smurf | this.type.bigSmurf, "come");
            } catch (e) {
                print(e);
                return false;
            }
        } else {
            this.sendMsg(this.type.smurfette, "mephTP");
            Town.move("cain");
            cain = getUnit(1, "deckard cain");
            if (cain) {
                cain.openMenu();
            }
            Town.move("portalspot");
            if (!this.waitTP(102)) {
                return false;
            }
        }

        for (time = 0; time < 90 && !Pather.usePortal(); time += 1) {
            delay(500);
        }
        for (time = 0;
                time < 90 && me.area === 103 && !this.inArea(103);
                time += 1) {
            delay(1000);
        }

        Pather.teleport = false;
        return this.inArea(103);
    },

    goToLastTown: function () {
        if (!me.getQuest(7, 0)
                && (me.getQuest(6, 0) || me.getQuest(6, 1))) {
            Pickit.pickItems();
            this.changeAct(2);
        }
        if (!me.getQuest(15, 0) && me.getQuest(7, 0)) {
            //if andy done, but not duriel
            Town.goToTown(2);
        }
        if (!me.getQuest(15, 0)
                && (me.getQuest(14, 0) || me.getQuest(14, 1)
                || me.getQuest(14, 3) || me.getQuest(14, 4))) {
            Pickit.pickItems();
            this.changeAct(3);
            //getQuest, (14, 0) = completed (talked to meshif),
            //(14, 3) = talked to tyrael,
            //(14, 4) = talked to jerhyn (<3 Imba)
        }
        if (!me.getQuest(23, 0) && me.getQuest(15, 0)) {
            //if duriel done, but not meph
            Town.goToTown(3);
        }
        if (!me.getQuest(23, 0) && me.area === 75
                && (me.getQuest(22, 0) || me.getQuest(22, 1))) {
            this.act3to4();
        }
        if (!me.getQuest(28, 0) && me.getQuest(23, 0)) {
            //if meph done, but not diablo
            Town.goToTown(4);
        }
        if (!me.getQuest(28, 0)
                && (me.getQuest(26, 0) || me.getQuest(26, 1))) {
            Pickit.pickItems();
            this.changeAct(5);
        }
        if (me.getQuest(28, 0)) {//if diablo done
            Town.goToTown(5);
        }
    },

    inArea: function (area) {
        var i, count,
            party = getParty();

        if (!area) {
            area = me.area;
        }
        if (me.area !== area) {
            return false;
        }

        for (i = 0; i < 3 && !party; i += 1) {
            delay(me.ping * 2 + 250);
            party = getParty();
        }

        count = 1; //first skipped ('me', with 0 area)
        while (party && party.getNext()) {
            if (party.area === area && this.names.indexOf(party.name) > -1) {
                count += 1;
            }
        }
        return count >= this.size;
    },

    inGame: function () {
        var i, j,
            party = getParty();

        for (i = 0; i < 3 && !party; i += 1) {
            delay(me.ping * 2 + 500);
            party = getParty();
        }
        i = 0;
        j = 0;
        if (party) {
            do {
                if (this.names.indexOf(party.name) > -1) {
                    i += 1;
                }
                j += 1;
            } while (party.getNext());
        }
        if (i - this.size) {
            quit();
        }

        return j;
    },

    isLevel: function (level) {
        var i,
            party = getParty();

        if (!level) {
            level = me.charlvl;
        }
        for (i = 0; i < 3 && !party; i += 1) {
            delay(me.ping * 3 + 500);
            party = getParty();
        }
        i = 0;
        if (party) {
            do {
                if (this.names.indexOf(party.name) > -1) {
                    if (party.level < level) {
                        return false;
                    }
                    i += 1;
                }
            } while (party.getNext());
        }
        return i >= this.size;
    },

    announce: function (msg) {
        print(msg);
        if (this.myType === this.type.smurfette
                && this.inGame() > this.size) {
            say(msg);
        }
    }
};

var Util = {
    confSave: {
        LifeChicken: Config.LifeChicken,
        TownHP: Config.TownHP,
        ManaChicken: Config.ManaChicken,
        MercChicken: Config.MercChicken,
        TownMP: Config.TownMP,
        TownCheck: Config.TownCheck
    },

    toggleChicken: function (restore) {
        if (restore) {
            Config.LifeChicken = this.confSave.LifeChicken;
            Config.TownHP = this.confSave.TownHP;
            Config.ManaChicken = this.confSave.ManaChicken;
            Config.MercChicken = this.confSave.MercChicken;
            Config.TownMP = this.confSave.TownMP;
            Config.TownCheck = this.confSave.TownCheck;
        } else if (!me.playertype) { //not for hardcore :D
            Config.LifeChicken = 0;
            Config.TownHP = 0;
            Config.ManaChicken = 0;
            Config.MercChicken = 0;
            Config.TownMP = 0;
            Config.TownCheck = false;
        }
    },

    smurfToExit: function (targetArea, use, clearPath) {
        this.refresh = function () {
            Packet.flash(me.gid);
            delay(me.ping * 2 + 250);
            Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5),
                            3, Config.ClearType);
            delay(me.ping);
            Packet.flash(me.gid);
            delay(me.ping * 2 + 250);
        };

        var i,
            j = 42,
            areas = [];

        if (targetArea instanceof Array) {
			areas = targetArea;
		} else {
			areas.push(targetArea);
		}

        for (i = 0; j && i < areas.length; i += 1) {
            for (j = 3; j && me.area !== areas[i]; j -= 1) {
                try {
                    if (!Pather.moveToExit(areas[i], use, clearPath)) {
                        this.refresh();
                    }
                } catch (e) {
                    print(e);
                    this.refresh();
                }
                while (!me.area) {
                    delay(50);
                }
            }
        }

        return me.area === areas[areas.length - 1];
    },

    startFollow: function () {
        print("startFollow");

        this.checkExit = function (area) { //thanks kolton! :D
            print("checkExit");

            var i, target,
                exits = getArea().exits;

            for (i = 0; i < exits.length; i += 1) {
                if (exits[i].target === area) {
                    this.smurfToExit(area, true, Config.ClearType);
                    return true;
                }
            }

            target = getUnit(2, "portal");
            if (target) {
                do {
                    if (target.objtype === area) {
                        Pather.usePortal(null, null, target);
                        return true;
                    }
                } while (target.getNext());
            }

            // Arcane<->Cellar portal
            if ((me.area === 74 && area === 54)
                    || (me.area === 54 && area === 74)) {
                Pather.usePortal(null);
                return true;
            }

            // Tal-Rasha's tomb->Duriel's lair
            if (me.area >= 66 && me.area <= 72 && area === 73) {
                Pather.useUnit(2, 100, area);
                return true;
            }

            // Throne->Chamber
            if (me.area === 131 && area === 132) {
                target = getUnit(2, 563);
                if (target) {
                    Pather.usePortal(null, null, target);
                    return true;
                }
            }

            return this.smurfToExit(area, true, Config.ClearType);
        };

        this.getLeaderUnit = function () {
            var player = getUnit(0, Team.names[0]);

            if (player) {
                do {
                    if (!player.dead) {
                        return player;
                    }
                } while (player.getNext());
            }

            return false;
        };

        var i,
            leader = false;

        Msg.x = 0;
        Msg.y = 0;
        Msg.area = 0;
        Msg.action = "go";
        if (Team.myType !== Team.type.smurf) {
            return false;
        }

        while (Msg.action !== "stop") {
            for (i = 0; i < 3 && (!leader || !copyUnit(leader).x); i += 1) {
                leader = this.getLeaderUnit();
                delay(me.ping + 100);
            }
            if (i === 3) {
                Team.sendMsg(Team.type.smurfette | Team.type.bigSmurf,
                                "update");
                delay(200);
            } else {
                Msg.x = leader.targetx;
                Msg.y = leader.targety;
                Msg.area = leader.area;
            }

            if (Msg.area && me.area && Msg.area !== me.area) {
                if (!this.checkExit(Msg.area)) {
                    if (!me.inTown) {
                        Pather.usePortal(null, null);
                    }
                    Town.goToTown();
                    Town.move("portalspot");
                    delay(1000 + 2 * me.ping);
                    for (i = 0; i < 120 && me.inTown; i += 1) {
                        Team.sendMsg(Team.type.bigSmurf, "tp");
                        delay(500 + me.ping * 2);
                        if (!Pather.usePortal(Msg.area, Team.names[0])
                                && !Pather.usePortal(null, Team.names[0])) {
                            Pather.usePortal(Msg.area, null);
                        }
                    }
                }
            }
            if (Msg.x && Msg.y && Msg.area && me.area && Msg.area === me.area) {
                Pather.moveTo(Msg.x + rand(-10, 10), Msg.y + rand(-10, 10),
                                3, Config.ClearType, true);
            }

            switch (Msg.action) {
            case "stop":
                break;
            case "wp":
                Msg.action = "go";
                Team.clickWP(false);
                break;
            case "pickit":
                Msg.action = "go";
                Pickit.pickItems();
                break;
            default:
                Attack.clear(10);
            }
            delay(250);
        }

        return true;
    },

    stopFollow: function () {
        print("stopFollow");
        Msg.action = "stop";
        if (Team.myType !== Team.type.smurf) {
            Team.sendMsg(Team.type.smurf, "stop");
        }
    },

    travel: function (goal) { //0->9
        //this is a custom waypoint getter function
        var i, j, target, unit,
            wpAreas = [],
            areaIDs = [];

        switch (goal) {
        case 0:
            wpAreas = [1, 3, 4, 5];
            areaIDs = [2, 3, 4, 10, 5];
            break;
        case 1:
            wpAreas = [1, 3, 4, 5, 6, 27, 29, 32, 35];
            areaIDs = [2, 3, 4, 10, 5, 6, 7, 26, 27, 28, 29,
                        30, 31, 32, 33, 34, 35];
            break;
        case 2:
            wpAreas = [40, 48, 42, 57, 43, 44];
            areaIDs = [41, 42, 43, 44];
            break;
        case 3:
            wpAreas = [52, 74];
            areaIDs = [50, 51, 52, 53, 54, 74];
            break;
        case 5:
            wpAreas = [75, 76, 77, 78, 79, 80, 81, 83];
            areaIDs = [76, 77, 78, 79, 80, 81, 82, 83];
            break;
        case 7:
            wpAreas = [103, 106, 107];
            areaIDs = [104, 105, 106, 107];
            break;
        case 8:
            wpAreas = [109, 111, 112, 113, 115, 117, 118];
            areaIDs = [110, 111, 112, 113, 115, 117, 118];
            break;
        case 9:
            wpAreas = [109, 111, 112, 113, 115, 117, 118, 129];
            areaIDs = [110, 111, 112, 113, 115, 117, 118, 120, 128, 129];
            break;
        default:
            return false;
        }

        Town.move("waypoint");
        Pather.getWP(me.area);

        target = Pather.plotCourse(wpAreas[wpAreas.length - 1], me.area);
        j = areaIDs.indexOf(target.course[0]) + 1;
        Team.announce("travel " + target.course);

        if (j < areaIDs.length) {
            if (me.inTown && wpAreas.indexOf(target.course[0]) > -1
                    && getWaypoint(wpAreas.indexOf(target.course[0]))) {
                Pather.useWaypoint(target.course[0],
                                    !Pather.plotCourse_openedWpMenu);
            }
            Precast.doPrecast(true);

            while (j < areaIDs.length) {
                Pather.teleport = !!me.diff || goal >= 3;
                if (Pather.teleport && me.charlvl >= 18) {
                    Config.ClearType = false;
                }

                switch (areaIDs[j]) { //actual goals
                case 53:// Palace -> palace...
                    Pather.moveTo(10109, 6732, 5, Config.ClearType);
                    this.smurfToExit(areaIDs[j], true, Config.ClearType);
                    break;
                case 74:// Palace -> Arcane
                    Pather.moveTo(10073, 8670, 5, 3, Config.ClearType);
                    Pather.usePortal(null);
                    break;
                case 78:// GreatMarsh(or not) -> Flayer Jungle
                    try {
                        Pather.moveToExit(areaIDs[j], true, Config.ClearType);
                    } catch (e1) {
                        print(e1);
                        Town.goToTown();
                        Pather.useWaypoint(76, true);
                        this.smurfToExit(areaIDs[j], true, Config.ClearType);
                    }
                    break;
                case 110: // Harrogath -> Bloody Foothills
                    Pather.moveTo(5026, 5095);
                    unit = getUnit(2, 449);// Gate
                    if (unit) {
                        for (i = 0; i < 10 && unit.mode !== 2; i += 1) {
                            if (unit.mode === 0) {
                                sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
                            }
                            delay(500);
                        }
                    }
                    this.smurfToExit(areaIDs[j], true, Config.ClearType);
                    break;
                default:
                    this.smurfToExit(areaIDs[j], true, Config.ClearType);
                }

                if (me.area && me.area !== areaIDs[j]) {
                    print("travel failed");
                    Town.goToTown();
                    return false;
                }
                if (wpAreas.indexOf(me.area) > -1) {
                    Team.clickWP();
                }
                j += 1;
            }
        }

        Town.goToTown();

        return true;
    },

    getQuestItem: function (classid, chestid) {
        print("picking QuestItem");

        var chest, item, i;

        if (me.getItem(classid)) {
            return true;
        }
        if (me.inTown) {
            return false;
        }
        if (chestid) {
            chest = getUnit(2, chestid);
            if (!chest) {
                return false;
            }
            Misc.openChest(chest);
        }
        item = getUnit(4, classid);
        for (i = 0; i < 10 && !item; i += 1) {
            delay(100 + me.ping);
            item = getUnit(4, classid);
        }
        if (!item) {
            return false;
        }
        if (!Storage.Inventory.CanFit(item)) {
            i = me.area;
            Town.goToTown();
            Town.doChores();
            Town.move("portalspot");
            Pather.usePortal(i, me.name);
            while (me.inTown()) {
                delay(50);
            }
        }
        for (i = 0; i < 3 && !Pickit.pickItem(item); i += 1) {
            delay(250 + me.ping * 2);
        }
        return !getUnit(4, classid); //(<3 kolton)
    },

    toInventory: function () {
        print("toInventory");

        var i,
            items = [],
            item = me.getItem(-1, 0);

        Town.goToTown();
        Town.doChores();
        if (!Town.openStash()) {
            Town.openStash();
        }
        if (item) {
            do {
                if (item.classid === 91 || item.classid === 174
                        || item.classid === 553 || item.classid === 554) {
                    items.push(copyUnit(item));
                }
            } while (item.getNext());
        }
        for (i = 0; i < items.length; i += 1) {
            delay(500 + me.ping);
            if (Storage.Inventory.CanFit(items[i])) {
                Storage.Inventory.MoveTo(items[i]);
            }
        }
        delay(1000);
        me.cancel();
    },

    talkTo: function (name) {
		var npc, i;

        if (!me.inTown) {
			Town.goToTown();
		}

        for (i = 5; i; i -= 1) {
            Town.move(name === "jerhyn" ? "palace" : name);
            npc = getUnit(1, name === "cain" ? "deckard cain" : name);
            if (npc) {
                if (npc.openMenu()) {
                    me.cancel();
                    return true;
                }
            }
            Packet.flash(me.gid);
            delay(me.ping * 2 + 500);
            Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5));
        }

		return false;
	},

    hireMerc: function (another) {
        print("hiring merc");

        var greiz, i, merc,
            item = [false, false, false],
            mercid = [];

        this.reallyGetMerc = function () {
            merc = false;
            for (i = 0; i < 10 && !merc; i += 1) {
                merc = me.getMerc();
                delay(100 + me.ping);
            }
        };

        this.getMercNaked = function () {
            var j,
                bodyLoc = [1, 3, 4];

            for (j = 0; j < 3; j += 1) {
                sendPacket(1, 0x61, 2, bodyLoc[j]); //merc to cursor
                for (i = 0; i < 11 && !me.itemoncursor; i += 1) {
                    delay(me.ping + 100);
                }
                if (me.itemoncursor) {
                    item[j] = getUnit(100);
                    sendPacket(1, 0x17, 4, item[j].gid); //drop
                    for (i = 0; i < 11 && me.itemoncursor; i += 1) {
                        delay(me.ping + 100);
                    }
                    if (me.itemoncursor) {
                        print("item to ground failed");
                        item[j] = getUnit(100);
                        sendPacket(1, 0x17, 4, item[j].gid); //drop
                        delay(me.ping * 2 + 250);
                    }
                }
            }
        };

        this.stopNaturism = function () {
            var j, nPos;

            for (j = 0; j < 3; j += 1) {
                if (item[j]) {
                    sendPacket(1, 0x16, 4, 0x4,
                                4, item[j].gid, 4, 1); //floor to cursor
                    for (i = 0; i < 11 && !me.itemoncursor; i += 1) {
                        delay(me.ping + 100);
                    }
                    if (!me.itemoncursor) {
                        print("item to cursor failed");
                        return;
                    }
                    sendPacket(1, 0x61, 2, 0x0000); //equip to merc
                    for (i = 0; i < 11 && me.itemoncursor; i += 1) {
                        delay(me.ping + 100);
                    }
                    if (me.itemoncursor) {
                        print("item to merc failed");
                        if (Storage.Inventory.CanFit(item[j])) {
                            nPos = Storage.Inventory.FindSpot(item[j]);
                            sendPacket(1, 0x18, 4, item[j].gid,
                                        4, nPos.y, 4, nPos.x, 4, 0); //to inv
                        } else {
                            sendPacket(1, 0x17, 4, item[j].gid); //drop
                        }
                    }
                    delay(200 + me.ping);
                }
            }
        };

        if (!me.gametype) {
            return true;
        }

        this.reallyGetMerc();
        if (!merc) {
            Town.reviveMerc();
            merc = this.reallyGetMerc();
            if (!merc) {
                return false;
            }
        }

        if (merc.classid !== 338 || another) { //act2 merc
            Town.goToTown(2);
            this.talkTo("greiz");
            this.getMercNaked();

            addEventListener("gamepacket", function (bytes) {
                if (bytes[0] === 0x4e) {
                    i = (bytes[2] << 8) + bytes[1];
                    if (mercid.indexOf(i) !== -1) {
                        mercid.length = 0;
                    }
                    mercid.push(i);
                }
            }); //(<3 QQ)

            greiz = getUnit(1, "greiz");
            if (!greiz || !greiz.openMenu()) {
                Packet.flash(me.gid);
                delay(1000 + me.ping);
                Town.move("greiz");
                greiz = getUnit(1, "greiz");
                if (!greiz || !greiz.openMenu()) {
                    print("hireMerc : failed to open npc menu");
                    Team.goToLastTown();
                    return false;
                }
            }
            if (mercid.length) {
                Misc.useMenu(0x0D45);
                sendPacket(1, 0x36, 4, greiz.gid,
                            4, mercid[rand(0, mercid.length - 1)]);
                delay(1000 + me.ping * 2);
            } else {
                print("No mercs available");
            }
            me.cancel();

            this.reallyGetMerc();
            if (!merc) {
                print("merc not found");
                Team.goToLastTown();
                return false;
            }

            this.stopNaturism();
        }
        Team.goToLastTown();
        return true; //(<3 QQ)
    }
};

var Quest = {
    act1: function () {
        this.den = function () {
            Team.announce("den");

            var cleartry;

            if (!me.getQuest(1, 1)) {
                Util.smurfToExit([1, 2], true, Config.ClearType);
                Util.startFollow();
                if (Team.myType !== Team.type.smurf) {
                    Util.smurfToExit([2, 3], true, Config.ClearType);
                    delay(500);
                    Team.clickWP();
                    Util.smurfToExit([2, 8], true, Config.ClearType);
                    Team.inGame();
                    for (cleartry = 1;
                            cleartry <= 3 && !me.getQuest(1, 1);
                            cleartry += 1) {
                        Team.announce("clearing - try number " + cleartry);
                        Attack.clearLevel();
                        delay(100);
                    }
                }
                Util.stopFollow();
                Util.smurfToExit([2, 1], true, Config.ClearType);
                if (!me.inTown) {
                    delay(1000);
                    Packet.flash(me.gid);
                    delay(500);
                    Util.smurfToExit([2, 1], false);
                    Util.smurfToExit([2, 1], true, Config.ClearType);
                }
            }

            if (me.inTown) {
                Util.talkTo("akara");
                Town.doChores();
                delay(1000);
            }

            return true;
        };

        this.cave = function () {
            Team.announce("cave");

            var chest, i;

            Pather.useWaypoint(3);
            for (i = 120; i && !Team.inArea(); i -= 1) {
                Attack.clear(40);
                delay(500);
            }
            if (!i && me.diff) {
                quit();
            }
            Precast.doPrecast(true);
            Util.startFollow();
            if (Team.myType !== Team.type.smurf) {
                Util.smurfToExit([9, 13], true, Config.ClearType);
                chest = getPresetUnit(me.area, 2, 397);
                if (chest) {
                    Pather.moveToUnit(chest, 0, 0, Config.ClearType);
                    Misc.openChest(chest);
                }
                Attack.clearLevel();
            }
            Util.stopFollow();

            if (me.diff) {
                Town.goToTown();
                return true;
            }
            if (Team.isLevel(SmurfConfig.caveLvl[me.diff])) {
                if (Util.smurfToExit([9, 3], true, Config.ClearType)) {
                    Team.clickWP(false);
                    Pather.useWaypoint(1);
                } else {
                    Town.goToTown();
                }
                return true;
            }

            return false;
        };

        this.bloodRaven = function () {
            Team.announce("BloodRaven");

            if (!me.getQuest(2, 1)) {
                Pather.useWaypoint(3);
                Precast.doPrecast(true);
                Pather.moveToExit(17, true, Config.ClearType);
                Team.inGame();
                try {
                    Pather.moveToPreset(17, 1, 805);
                    Attack.kill(getLocaleString(3111)); // Blood Raven
                } catch (e) {
                    print(e);
                    Attack.clear(30);
                }
                Pickit.pickItems();
                Town.goToTown();
            }
            Util.talkTo("kashya");

            return true;
        };

        this.cain = function () {
            Team.announce("cain");

            var i, unit,
                stones = [];

            if (!me.getQuest(4, 1)) {
                Util.startFollow();
                if (Team.myType !== Team.type.smurf) {
                    Util.travel(0);
                }
                Util.stopFollow();
                //4,3 -> may be true in wierd cases (scroll lost?)
                if (!me.getQuest(4, 4) //redportal already open
                      //&& !me.getQuest(4, 3) //'holding scroll'
                        && !me.getItem(524) && !me.getItem(525)) {
                    Town.goToTown();
                    Pather.useWaypoint(5, true); //dark wood
                    Precast.doPrecast(true);

                    for (i = 0; i < 3 && !me.getItem(524); i += 1) {
                        Pather.moveToPreset(me.area, 1, 738, 0, 0,
                                            Config.ClearType); //tree
                        unit = getUnit(2, 30); //tree
                        if (unit) {
                            Pather.moveToUnit(unit);
                            sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
                            delay(me.ping *  2 + 100);
                            Util.getQuestItem(524);
                        }
                        Attack.clear(20); // treehead
                        delay(200 + me.ping * 2);
                    }
                    Team.inGame();
                    if (!Pather.usePortal(null, null)) {
                        Town.goToTown();
                    }
                    unit = me.getItem(524); //another scroll...
                    if (unit) {
                        if (unit.location !== 7
                                && Storage.Stash.CanFit(unit)) {
                            Storage.Stash.MoveTo(unit);
                            delay(me.ping * 2 + 100);
                            me.cancel();
                        }
                    }
                }

                Util.talkTo("akara");
                unit = me.getItem(525); //yay! this is the last scroll
                if (unit) {
                    if (unit.location !== 7 && Storage.Stash.CanFit(unit)) {
                        Storage.Stash.MoveTo(unit);
                        delay(me.ping);
                        me.cancel();
                    }
                }
                Team.inGame();
                Pather.useWaypoint(4, true); //stoney field
                Precast.doPrecast(true);
                Pather.moveToPreset(me.area, 1, 737, 0, 0,
                                    Config.ClearType);
                try {
                    Attack.clear(15, 0, getLocaleString(2872));// Rakanishu
                } catch (e2) {
                    print(e2);
                    Attack.clear(20);
                }
                Attack.clear(20);

                if (!me.getQuest(4, 4)) { //redportal already open
                    Team.inGame();
                    for (i = 17; i <= 21; i += 1) {
                        stones.push(getUnit(2, i));
                    }
                    for (i = 0; i < 5; i += 1) { //brute-forcing...
                        for (unit = stones.length - 1; unit >= 0; unit -= 1) {
                            Misc.openChest(stones[unit]);
                        }
                    }
                }
                for (i = 10; i && !Pather.usePortal(38); i -= 1) {
                    delay(500 + me.ping * 2);
                }
                if (!i) {
                    print("cain failed");
                    return false;
                }
                unit = getUnit(2, 26); //sad cain
                Misc.openChest(unit);
                if (!Pather.usePortal(null, null)) {
                    Town.goToTown();
                }
                delay(3000);
            }

            Util.talkTo("akara");
            Util.talkTo("cain");  //happy cain

            return true;
        };

        this.trist = function () {
            Team.announce("trist");

            var i,
                xx = [ 25175, 25147, 25149, 25127, 25128, 25150, 25081,
                    25066, 25045, 25061, 25048, 25099, 25109, 25078, 25154],
                yy = [ 5187,  5201,  5172,  5188,  5144,  5123,  5137,
                    5195,  5186,  5099,  5055,  5058,  5095,  5093,  5095];

            if (!me.getQuest(4, 0)) {
                return this.cain();
            }
            Pather.useWaypoint(4);
            Precast.doPrecast(true);
            Pather.moveToPreset(me.area, 1, 737, 0, 0, Config.ClearType, true);
            try {
                Attack.clear(15, 0, getLocaleString(2872)); // Rakanishu
            } catch (e) {
                print(e);
                Attack.clear(20);
            }
            for (i = 0; i < 10 && !Pather.usePortal(38); i += 1) {
                delay(500 + me.ping * 2);
            }

            for (i = 0; i < xx.length; i += 1) {
                Pather.moveTo(xx[i], yy[i], 3, Config.ClearType);
                Attack.clear(20);
            }

            return Team.isLevel(SmurfConfig.tristLvl[me.diff]);
        };

        this.andy = function () {
            Team.announce("andy");

            if (me.getQuest(6, 0) && !me.getQuest(7, 0)) {
                Team.changeAct(2);
                return true;
            }

            if (!me.getQuest(6, 1)) {
                if (!me.diff) {
                    Util.startFollow();
                }
                if ((Team.myType === Team.type.smurfette && me.diff)
                        || (Team.myType !== Team.type.smurf && !me.diff)) {
                    try {
                        Util.travel(1);
                    } catch (e1) {
                        Attack.clearLevel();
                        Town.goToTown();
                        print("travel failed, waiting 3mn : " + e1); //pro!
                        delay(180000);
                    }
                    Pather.useWaypoint(35, true);
                    Precast.doPrecast(true);
                    Pather.teleport = !!me.diff;

                    if (!Pather.teleport
                            || !Util.smurfToExit([36, 37], true,
                                                Config.ClearType)) {
                        Util.smurfToExit([36, 37], true);
                    }
                } else if (!Team.waitTP(37)) {
                    return true;
                }
                Team.inGame();
                Precast.doPrecast(true);
                delay(500);
                if (me.diff !== 2) {
                    Pather.teleport = false;
                    Pather.makePortal();
                    Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                    Pather.moveTo(22594, 9641, 3, Config.ClearType);
                    Pather.moveTo(22564, 9629, 3, Config.ClearType);
                    Pather.moveTo(22533, 9641, 3, Config.ClearType);
                    Pather.moveTo(22568, 9582, 3, Config.ClearType);
                    Pather.moveTo(22548, 9568, 3, Config.ClearType);
                } else {
                    Pather.moveTo(22548, 9568);
                    Pather.makePortal();
                    Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                }
                try {
                    Attack.kill(156); // Andariel
                } catch (e2) {
                    print(e2);
                    Attack.clear(35);
                }
                delay(2000); // Wait for minions to die.
                Util.stopFollow();
                Pickit.pickItems();
                if (!Pather.usePortal(null, null)) {
                    Town.goToTown();
                }
            }
            delay(3000);
            Team.changeAct(2);

            return true;
        };

        Town.goToTown(1);

        if (!me.getQuest(1, 0)) {
            return this.den();
        }
        if (!Team.isLevel(SmurfConfig.caveLvl[me.diff])) {
            return this.cave();
        }
        if (Msg.action === "broken") {
            this.cave(); // + andy
        }
        if (!me.diff) {
            if (!me.getQuest(2, 0)) {
                return this.bloodRaven();
            }
            if (!me.getQuest(4, 0)) {
                return this.cain();
            }
        }
        if (!Team.isLevel(SmurfConfig.tristLvl[me.diff])) {
            return this.trist();
        }

        return this.andy();
    },

    act2: function () {
        this.cube = function () {
            Team.announce("getting cube");

            this.toChest = function () {
                try {
                    if (!Pather.moveToPreset(me.area, 2, 354,
                                                0, 0, Config.ClearType)) {
                        Attack.clear(20);
                        Pather.moveToPreset(me.area, 2, 354);
                    }
                } catch (e) {
                    print(e);
                }
                Attack.clear(20);
            };

            this.lead = function () {
                var i;

                Util.travel(2);
                Pather.useWaypoint(42, true);
                Precast.doPrecast(true);
                if (getWaypoint(12)) {
                    Pather.useWaypoint(57, true);
                }
                for (i = 0; i < 3; i += 1) {
                    if (me.area === 42) {
                        Util.smurfToExit(56, true, Config.ClearType);
                    }
                    if (me.area === 56) {
                        Util.smurfToExit(57, true, Config.ClearType);
                    }
                    if (me.area === 57) {
                        Team.clickWP();
                        Util.smurfToExit(60, true, Config.ClearType);
                    }
                    if (me.area === 60) {
                        this.toChest();
                    }
                }
            };

            Util.startFollow();
            if (Team.myType !== Team.type.smurf) {
                this.lead();
            }
            Util.stopFollow();

            this.toChest();
            Util.getQuestItem(549, 354);
            // delay(500 + me.ping);
            if (!Pather.usePortal(null, null)) {
                Town.goToTown();
            }

            return true;
        };

        this.amulet = function () {
            Team.announce("getting amulet");

            var i,
                path = [44, 45, 58, 61];

            Util.talkTo("drognan");
            if (Team.myType === Team.type.smurfette || !me.diff) {
                Util.travel(2);
                Pather.useWaypoint(44, true);
                Precast.doPrecast(true);
                if (!me.diff) {
                    Util.startFollow();
                    while (me.area !== 61) {
                        if (path.indexOf(me.area) === -1) {
                            Pather.useWaypoint(44, true);
                        } else if (me.area === 58) {
                            Team.clickWP();
                        }
                        Util.smurfToExit(path[path.indexOf(me.area) + 1],
                                                true, Config.ClearType);
                    }
                    Util.stopFollow();
                    Pather.moveTo(15044, 14045, 3, Config.ClearType);
                } else {
                    Pather.teleport = true;
                    Config.ClearType = false;
                    Util.smurfToExit([45, 58, 61], true);
                    Pather.moveTo(15044, 14045);
                }

                Team.inGame();
                Util.getQuestItem(521, 149);
                // delay(500 + me.ping);
                if (!Pather.usePortal(null, null)) {
                    Town.goToTown();
                }
                if (me.getItem(521)) {
                    delay(500 + me.ping);
                    if (Storage.Stash.CanFit(me.getItem(521))) {
                        Storage.Stash.MoveTo(me.getItem(521));
                    }
                    delay(me.ping);
                    me.cancel();
                }
                Town.move("drognan");
                for (i = 0; i < 200 && !Team.inArea(40); i += 1) {
                    if (i > 60) {
                        return false;
                    }
                    delay(1000);
                }
            }
            delay(500 + me.ping);
            Util.talkTo("drognan");
            Util.talkTo("cain");

            return true;
        };

        this.staff = function () {
            Team.announce("getting staff");

            Util.travel(2);
            Pather.teleport = true;

            Pather.useWaypoint(43, true);
            Precast.doPrecast(true);

            Util.smurfToExit([62, 63, 64], true);
            Pather.moveToPreset(me.area, 2, 356);

            Util.getQuestItem(92, 356);
            // delay(500 + me.ping);
            if (!Pather.usePortal(null, null)) {
                Town.goToTown();
            }
            if (me.getItem(92)) {
                delay(500 + me.ping);
                if (Storage.Stash.CanFit(me.getItem(92))) {
                    Town.goToTown();
                    if (Storage.Stash.CanFit(me.getItem(92))) {
                        Storage.Stash.MoveTo(me.getItem(92));
                    }
                    delay(me.ping);
                    me.cancel();
                }
            }

            return true;
        };

        this.cubeStaff = function () {
            Team.announce("cubing staff");

            var amulet = me.getItem("vip"),
                staff = me.getItem("msf");

            if (!staff || !amulet) {
                return false;
            }
            Town.doChores();
            Town.move("stash");
            if (!Town.openStash()) {
                Town.openStash();
            }
            Storage.Cube.MoveTo(amulet);
            Storage.Cube.MoveTo(staff);
            Cubing.openCube();
            transmute();
            delay(750 + me.ping);
            Cubing.emptyCube();
            me.cancel();

            return true; //(<3 kolton)
        };

        this.summoner = function () {
            Team.announce("killing summoner");

            var i, journal, preset,
                spot = {};


            if (me.charlvl >= 18) {
                Pather.teleport = true;
                Config.ClearType = false;
            }
            if (!Team.isLevel(18)) {
                Util.startFollow();
                if (Team.myType !== Team.type.smurf) {
                    Util.travel(3);
                    delay(500 + me.ping * 2);
                }
                Util.stopFollow();
            }
            if (Team.myType === Team.type.smurfette) {
                if (me.area !== 74) {
                    Town.goToTown();
                    Town.move("waypoint");
                    Pather.useWaypoint(74, true);
                }
                Precast.doPrecast(true);
                preset = getPresetUnit(me.area, 2, 357);
                switch (preset.roomx * 5 + preset.x) {
                case 25011:
                    spot = {x: 25081, y: 5446};
                    break;
                case 25866:
                    spot = {x: 25830, y: 5447};
                    break;
                case 25431:
                    switch (preset.roomy * 5 + preset.y) {
                    case 5011:
                        spot = {x: 25449, y: 5081};
                        break;
                    case 5861:
                        spot = {x: 25447, y: 5822};
                        break;
                    }
                    break;
                }

                if (!Pather.teleport) {
                    Pather.makePortal();
                    Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                }


                Pather.moveTo(spot.x, spot.y, 10, Config.ClearType);
                Pather.moveToPreset(me.area, 2, 357, 0, 0, Config.ClearType);
                Team.inGame();
                Pather.makePortal();
                Config.ClearType = 0;
                Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                try {
                    Attack.kill(250);
                } catch (e1) {
                    print(e1);
                    Attack.clear(20);
                }

                for (i = 0; i < 20 && !Pather.usePortal(46); i += 1) {
                    if (journal) {
                        sendPacket(1, 0x13, 4, journal.type, 4, journal.gid);
                        delay(300 + me.ping);
                        me.cancel();
                    } else {
                        journal = getUnit(2, 357);
                        Pickit.pickItems();
                    }
                    delay(100 + me.ping);
                }
                if (i === 20) {
                    print("summoner failed");
                    return true;
                }
                Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "stop");
                Team.clickWP();
            } else if (Team.waitTP(74, 20)) {
                while (!Pather.usePortal(46)) {
                    try {
                        Pather.moveToPreset(me.area, 2, 357, 0, 0,
                                                Config.ClearType);
                        Attack.kill(250);
                    } catch (e2) {
                        print(e2);
                        Attack.clear(20);
                    }
                    delay(100);
                }
                Team.clickWP();
            } else {
                return true;
            }

            if (!Pather.useWaypoint(40, true)) {
                Town.goToTown();
            }
            Util.talkTo("cain");
            Util.talkTo("drognan");

            return Team.sync();
        };

        this.tombs = function () {
            Team.announce("cleaning tombs");

            var i, j, unit, tpTome;

            tpTome = me.findItem("tbk", 0, 3);

            Util.talkTo("cain");
            Town.move("portalspot");
            if (Team.myType === Team.type.smurfette) {
                if (me.area !== 46) {
                    try {
                        Town.move("waypoint");
                        Pather.useWaypoint(46, true);
                    } catch (e) {
                        print(e);
                        this.summoner();
                    }
                }
                if (tpTome.getStat(70)) {
                    Pather.makePortal();
                    Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                }
            } else if (!Team.waitTP(46)) {
                return Team.isLevel(SmurfConfig.tombsLvl[me.diff]);
            }
            Team.clickWP();
            Precast.doPrecast(true);

            for (i = 66; i <= 72; i += 1) {
                if (Team.myType === Team.type.smurfette) {
                    Util.smurfToExit(i, false, Config.ClearType);
                    if (tpTome.getStat(70)) {
                        Pather.makePortal();
                    }
                    delay(2000);
                }
                Util.smurfToExit(i, true, Config.ClearType);
                unit = false;
                for (j = 0; j < 5 && !unit; j += 1) {
                    unit = getPresetUnit(me.area, 2, 397); //chest
                    delay(me.ping * 2 + 100);
                }
                if (!unit) {
                    unit = getPresetUnit(me.area, 2, 152); //orifice
                    if (unit) {
                        try {
                            Pather.moveToPreset(me.area, 2, 152, 0, 0,
                                                Config.ClearType);
                        } catch (e3) {
                            print(e3);
                            try {
                                Pather.moveToPreset(me.area, 2, 152, 0, 0,
                                                    Config.ClearType);
                            } catch (e4) {
                                print(e4); //experimental
                                unit = getUnit(0); //player
                                if (unit) {
                                    do {
                                        if (unit.name !== me.name) {
                                            Pather.moveToUnit(unit, 0, 0,
                                                              Config.ClearType);
                                            Attack.clear(20);
                                            delay(1000);
                                        }
                                    } while (unit.getNext());
                                }
                            }
                        }
                    }
                } else if (unit && !unit.mode) {
                    try {
                        Pather.moveToPreset(me.area, 2, 397, 0, 0,
                                            Config.ClearType);
                    } catch (e1) {
                        print(e1);
                        try {
                            Pather.moveToPreset(me.area, 2, 397, 0, 0,
                                                Config.ClearType);
                        } catch (e2) {
                            print(e2);
                            unit = getUnit(0);
                            if (unit) {
                                do {
                                    if (unit.name !== me.name) {
                                        Pather.moveToUnit(unit, 0, 0,
                                                            Config.ClearType);
                                        Attack.clear(20);
                                        delay(1000);
                                    }
                                } while (unit.getNext());
                            }
                        }
                    }
                }

                Attack.clear(50);
                if (!Pather.usePortal(null, null)) {
                    Town.goToTown();
                }
                delay(me.ping);
                if (!Pather.usePortal(46, null)) {
                    Town.move("waypoint");
                    Pather.useWaypoint(46);
                }
                
                if (Team.isLevel(SmurfConfig.tombsLvl[me.diff])) {
                    return true;
                }
            }

            return Team.isLevel(SmurfConfig.tombsLvl[me.diff]);
        };

        this.duriel = function () {
            Team.announce("killing duriel");

            this.placeStaff = function () {
                Team.announce("place staff");

                var staff, orifice,
                    preArea = me.area;

                Town.goToTown();
                Town.move("stash");
                Util.toInventory();
                Town.move("portalspot");
                if (!Pather.usePortal(preArea, me.name)) {
                    throw new Error("placeStaff: Failed to take TP");
                }
                delay(1000);
                Team.inGame();
                orifice = getUnit(2, 152);
                if (!orifice) {
                    return false;
                }
                Misc.openChest(orifice);
                staff = me.getItem(91);
                if (!staff) {
                    return false;
                }
                staff.toCursor();
                submitItem();
                delay(250 + me.ping * 2);
                Town.goToTown();
                delay(12000);
                if (!Pather.usePortal(preArea, me.name)) {
                    throw new Error("placeStaff: Failed to take TP");
                }

                return true;
            };

            var unit, i;

            Pather.teleport = true;

            if (!me.getQuest(14, 1) && !me.getQuest(14, 3)
                    && !me.getQuest(14, 4)) {
                if (Team.myType === Team.type.smurfette) {
                    Pather.useWaypoint(46, true);
                    Precast.doPrecast(true);

                    Util.smurfToExit(getRoom().correcttomb, true);
                    for (i = 0; i < 3; i += 1) {
                        try {
                            Pather.moveToPreset(me.area, 2, 152);
                        } catch (e1) {
                            print(e1);
                            Pather.moveTo(me.x + rand(-5, 5),
                                            me.y + rand(-5, 5));
                        }
                    }
                    if (!me.getQuest(10, 0) && me.getItem(91)) { //staff
                        this.placeStaff();
                    }
                    Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                    Precast.doPrecast(true);
                    unit = getUnit(2, 100); //hole
                    for (i = 0; i < 600 && !unit; i += 1) {
                        try {
                            Pather.moveTo(me.x + rand(-8, 8),
                                            me.y + rand(-8, 8));
                            Pather.moveToPreset(me.area, 2, 152);
                        } catch (e2) {
                            print(e2);
                        }
                        unit = getUnit(2, 100); //hole
                        delay(100 + me.ping);
                    }
                    if (!unit) {
                        return true;
                    }
                    for (i = 0; i < 3 && me.area !== 73; i += 1) {
                        Pather.useUnit(2, 100, 73);
                        delay(100 + me.ping);
                    }
                    if (me.area !== 73) {
                        return true;
                    }
                    Pather.makePortal();
                } else if (!Team.waitTP(73, 9)) {
                    return true;
                }
                Team.inGame();
                Attack.clear(35);
                try {
                    Attack.kill(211);
                } catch (e) {
                    print(e);
                    Attack.clear(30);
                }
                Pickit.pickItems();
                Pather.teleport = false;
                Pather.moveTo(22579, 15706);
                Pather.moveTo(22577, 15649, 10);
                Pather.moveTo(22577, 15609, 10);

                //talk tyra
                unit = getUnit(1, "tyrael");
                if (!unit) {
                    return true;
                }
                for (i = 0; i < 3; i += 1) {
                    if (getDistance(me, unit) > 3) {
                        Pather.moveToUnit(unit);
                    }
                    sendPacket(1, 0x31, 4, unit.gid, 4, 302);
                    delay(me.ping);
                }
                Town.goToTown();
            }

            Team.changeAct(3);

            return true;
        };

        Town.goToTown(2);
        if (!me.getItem(549) && !me.diff) {
            Util.hireMerc();
            return this.cube();
        }
        if (!me.getQuest(11, 0)) {
            return this.amulet();
        }

        if (!me.getQuest(12, 0) || !me.getQuest(13, 0)) {
            return this.summoner();
        }
        if (!Team.isLevel(SmurfConfig.tombsLvl[me.diff])) {
            return this.tombs();
        }

        if (!me.getQuest(10, 0) && Team.myType === Team.type.smurfette) {
            // Util.travel(4);
            if (!me.getItem(92) && !me.getItem(91)) {
                return this.staff();
            }
            if (me.getItem(521) && me.getItem(92) && me.getItem(549)) {
                return this.cubeStaff();
            }
        }

        return this.duriel();
    },

    act3: function () {
        this.figurine = function () {
            Team.announce("figurine");
            var unit;

            if (me.getItem(546)) { //ajadefigurine
                Util.talkTo("cain");
                Util.talkTo("meshif");
                Util.talkTo("cain");
            }
            if (me.getItem(547)) {
                Util.talkTo("cain");
                Util.talkTo("alkor");
            }
            if (me.getQuest(20, 1)) {
                Util.talkTo("cain");
                Util.talkTo("alkor");
            }
            if (me.getItem(545)) {
                unit = getUnit(4, 545);
                if (unit) {
                    clickItem(1, unit);
                }
            }

            return true;
        };

        this.lamEssen = function () {
            Team.announce("lam essen");

            var alkor;

            Town.move("alkor");
            alkor = getUnit(1, "alkor");
            if (alkor) {
                sendPacket(1, 0x31, 4, alkor.gid, 4, 564);
                    //FREE QUEST! (<3 Imba)
                delay(me.ping);
            }

            return true;
        };

        this.eye = function () {
            Team.announce("getting eye");

            var units, unit;

            Pather.teleport = true;
            Pather.useWaypoint(76, true);
            Precast.doPrecast(true);

            Util.smurfToExit(85, true);
            if (me.area !== 85) {
                units = getPresetUnits(me.area, 5, 51);
                unit = units[1];
                Pather.moveToUnit(unit);
                Pather.useUnit(5, 51);
            }
            Pather.moveToPreset(me.area, 2, 407);

            Util.getQuestItem(553, 407);
            // delay(300);
            Town.goToTown();
            delay(500 + me.ping);
            if (me.getItem(553)) {
                if (me.inTown && Storage.Stash.CanFit(me.getItem(553))) {
                    Storage.Stash.MoveTo(me.getItem(553));
                }
                delay(me.ping);
                me.cancel();
            }
            delay(500);

            return true;
        };

        this.heart = function () {
            Team.announce("getting heart");

            Pather.teleport = true;
            Pather.useWaypoint(80, true);
            Precast.doPrecast(true);

            Util.smurfToExit([92, 93], true);
            Pather.moveToPreset(me.area, 2, 405);

            Util.getQuestItem(554, 405);
            // delay(300);
            Town.goToTown();
            delay(500 + me.ping);
            if (me.getItem(554)) {
                if (me.inTown && Storage.Stash.CanFit(me.getItem(554))) {
                    Storage.Stash.MoveTo(me.getItem(554));
                }
                delay(me.ping);
                me.cancel();
            }
            delay(500);

            return true;
        };

        this.brain = function () {
            Team.announce("getting brain");

            Pather.teleport = true;
            Pather.useWaypoint(78, true);
            Precast.doPrecast(true);

            Util.smurfToExit([88, 89, 91], true);
            try {
                Pather.moveToPreset(me.area, 2, 406);
            } catch (e1) {
                print(e1);
                return true;
            }

            Util.getQuestItem(555, 406);
            // delay(300);
            Town.goToTown();
            delay(500 + me.ping);
            if (me.getItem(555)) {
                if (me.inTown && Storage.Stash.CanFit(me.getItem(555))) {
                    Storage.Stash.MoveTo(me.getItem(555));
                }
                delay(me.ping);
                me.cancel();
            }
            delay(500);

            return true;
        };

        this.travincal = function () {
            Team.announce("travincal");

            this.cubeFlail = function () {
                print("cubing flail");

                var eye = me.getItem(553),
                    heart = me.getItem(554),
                    brain = me.getItem(555),
                    flail = me.getItem(173);

                if (!eye || !heart || !brain || !flail) {
                    return;
                }
                if (!me.inTown) {
                    Town.goToTown();
                    delay(500 + me.ping);
                }
                Town.move("stash");
                if (!Town.openStash()) {
                    Town.openStash();
                }
                Storage.Cube.MoveTo(eye);
                Storage.Cube.MoveTo(heart);
                Storage.Cube.MoveTo(brain);
                Storage.Cube.MoveTo(flail);
                Cubing.openCube();
                transmute();
                delay(750 + me.ping);
                Cubing.emptyCube();
                me.cancel();

                Town.move("portalspot");
                if (!Pather.usePortal(83, me.name)
                        && !Pather.usePortal(83)) {
                    Pather.useWaypoint(83);
                    Pather.moveTo(me.x + 129, me.y - 92);
                }
            };

            this.placeFlail = function () {
                print("place flail");

                var i, orb, nPos,
                    item = me.getItem(174);//flail

                if (!item) {
                    return false;
                }
                Team.inGame();
                Town.goToTown();
                while (!me.inTown) {
                    delay(500);
                }
                Town.move("stash");
                delay(500 + me.ping);
                Util.toInventory();
                for (i = 0; i < 10 && !me.itemoncursor; i += 1) {
                    sendPacket(1, 0x19, 4, item.gid); //unit to cursor
                    delay(me.ping * 2 + 500);
                }
                if (!me.itemoncursor) {
                    return false;
                }
                sendPacket(1, 0x1a, 4, item.gid, 2, 0x0004, 2, 0); //equip...
                delay(50);
                sendPacket(1, 0x1d, 4, item.gid,
                            2, 0x0004, 2, 0); //...swap : spam!
                delay(me.ping * 3 + 250);
                if (me.itemoncursor) {
                    item = getUnit(100); //onCursor
                    if (Storage.Inventory.CanFit(item)) {
                        nPos = Storage.Inventory.FindSpot(item);
                        sendPacket(1, 0x18, 4, item.gid,
                                    4, nPos.y, 4, nPos.x, 4, 0); //to inv
                    } else {
                        sendPacket(1, 0x17, 4, item.gid); //drop
                    }
                }
                delay(me.ping * 3 + 250);

                Town.move("portalspot");
                Config.PacketCasting = 1;
                if (!Pather.usePortal(83, me.name)
                        && !Pather.usePortal(83, null)) {
                    Pather.useWaypoint(83);
                    Pather.moveTo(me.x + 129, me.y - 92);
                }
                for (i = 0; i < 5 && !orb; i += 1) {
                    orb = getUnit(2, 404);
                    delay(100 + me.ping);
                }
                if (!orb) {
                    return false;
                }
                Pather.moveToUnit(orb);
                for (i = 0; i < 3 && orb; i += 1) {
                    Skill.cast(0, 0, orb);
                    delay(250 + me.ping * 2);
                    orb = getUnit(2, 404);
                }
                Town.goToTown();
                if (item) {
                    Items.equip(item);
                }
                delay(7000);
                Util.talkTo("cain");
                Town.move("portalspot");
                if (!Pather.usePortal(83, me.name)
                        && !Pather.usePortal(83, null)) {
                    Pather.useWaypoint(83);
                    Pather.moveTo(me.x + 129, me.y - 92);
                }

                return true;
            };

            var i, j, unit,
                boss = [2863, 2860, 2862]; //ismail, toorc, geleb local string

            Util.talkTo("cain");
            Pather.teleport = true;
            Config.ClearType = false;
            if (Team.myType === Team.type.smurfette) {
                this.cubeFlail();
                Pather.useWaypoint(83);
                Pather.moveTo(me.x + 129, me.y - 92); //(<3 kolton)
                Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                Pather.makePortal();
            } else if (!Team.waitTP(83, 20)) {
                return true;
            }
            Precast.doPrecast(true);

            for (i = 0; i < 3; i += 1) {
                Team.inGame();
                for (j = 0;
                        j < 3 && (!me.getQuest(21, 0) || !me.getQuest(21, 1))
                              && (!me.getQuest(18, 0) || !me.getQuest(18, 1));
                        j += 1) {
                    try {
                        Attack.kill(getLocaleString(boss[j]));
                    } catch (e) {
                        print(e);
                        Attack.clear(15);
                    }

                    if (Team.myType === Team.type.smurfette
                            && !me.getQuest(18, 0)) {
                        unit = getUnit(4, 173); //flail
                        if (unit && !me.getItem(174)) {
                            Util.getQuestItem(173);
                            delay(250 + me.ping);
                        }
                        unit = getUnit(4, 546); //ajadefigurine
                        if (unit) {
                            Util.getQuestItem(546);
                            delay(250 + me.ping);
                        }
                        if (me.getItem(173)) {
                            this.cubeFlail();
                        }
                        if (me.getItem(174) && !this.placeFlail()) {
                            return false;
                        }
                    }
                    sendPacket(1, 0x40); //refresh quest state
                    delay(100 + me.ping);
                }
            }

            Town.goToTown();
            Util.talkTo("cain");

            return true;
        };

        this.mephisto = function () {
            Team.announce("mephisto");

            var time;

            Util.talkTo("cain");
            Town.move("portalspot");
            Pather.teleport = true;
            if (Team.myType === Team.type.smurfette) {
                Pather.useWaypoint(101, true);
                Precast.doPrecast(true);
                Util.smurfToExit(102, true);
                Pather.moveTo(17566, 8069);
                Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                Pather.makePortal();
            } else if (!Team.waitTP(102, 10)) {
                return true;
            }
            if (!me.getQuest(22, 0)) {
                Team.inGame();
                try {
                    Attack.kill(242);
                } catch (e2) {
                    print(e2);
                    Attack.clear(20);
                }
                Pickit.pickItems();
            }
            Pather.moveTo(17590, 8068);
            for (time = 0; time < 90 && !Pather.usePortal(); time += 1) {
                delay(500);
            }
            for (time = 0;
                    time < 90 && me.area === 103 && !Team.inArea(103);
                    time += 1) {
                delay(1000);
            }
            return Team.inArea(103);
        };

        Town.goToTown(3);

        if (!me.getQuest(20, 0)) {
            this.figurine();
        }

        if (Team.myType === Team.type.smurfette) {
            if (!me.getItem(174) && !me.getQuest(18, 0)) { //flail
                if (!me.getItem(553)) {
                    Util.travel(5);
                    return this.eye();
                }
                if (!me.getItem(554)) {
                    return this.heart();
                }
                if (!me.getItem(555)) {
                    return this.brain();
                }
            }
        } else if (Team.myType === Team.type.bigSmurf
                && (me.getQuest(17, 1) || !me.getQuest(17, 0))) {
            return this.lamEssen();
        }

        if (!me.getQuest(18, 0) || !me.getQuest(21, 0)) {
            return this.travincal();
        }

        return this.mephisto();
    },

    act4: function () {
        this.izual = function () {
            Team.announce("izual");

            Pather.teleport = true;
            if (!me.getQuest(25, 1)) {
                if (Team.myType === Team.type.smurfette) {
                    Precast.doPrecast(true);
                    Util.smurfToExit([104, 105], true);
                    Pather.moveToPreset(105, 1, 256);
                    Pather.makePortal();
                    Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
                } else if (!Team.waitTP(105)) {
                    return true;
                }
                Team.inGame();
                try {
                    if (!Attack.clear(15, 0, 256)) { // izu
                        Attack.clear(20);
                    }
                } catch (e) {
                    print(e);
                    Attack.clear(20);
                }
                Town.goToTown();
            }
            Util.talkTo("tyrael");

            return true;
        };

        this.diablo = function () { //(<3 kolton)
            Team.announce("diablo");

            // Sort function
            this.sort = function (a, b) {
                // Entrance to Star / De Seis
                if (me.y > 5325 || me.y < 5260) {
                    if (a.y > b.y) {
                        return -1;
                    }
                    return 1;
                }
                // Vizier
                if (me.x < 7765) {
                    if (a.x > b.x) {
                        return -1;
                    }
                    return 1;
                }
                // Infector
                if (me.x > 7825) {
                    if (!checkCollision(me, a, 0x1) && a.x < b.x) {
                        return -1;
                    }
                    return 1;
                }

                return getDistance(me, a) - getDistance(me, b);
            };

            // general functions
            this.getLayout = function (seal, value) {
                var sealPreset = getPresetUnit(108, 2, seal);

                if (!seal) {
                    throw new Error("Seal preset not found. Can't continue.");
                }
                if (sealPreset.roomy * 5 + sealPreset.y === value
                        || sealPreset.roomx * 5 + sealPreset.x === value) {
                    return 1;
                }
                return 2;
            };

            this.initLayout = function () {
                this.vizLayout = this.getLayout(396, 5275);
                this.seisLayout = this.getLayout(394, 7773);
                this.infLayout = this.getLayout(392, 7893);
            };

            this.openSeal = function (classid) {
                var i, seal;

                for (i = 0; i < 5; i += 1) {
                    if (classid === 394) {
                        Pather.moveToPreset(me.area, 2, classid, 5, 5,
                                            Config.ClearType);
                    } else {
                        Pather.moveToPreset(me.area, 2, classid, 2, 0,
                                            Config.ClearType);
                    }
                    seal = getUnit(2, classid);
                    if (!seal) {
                        return false;
                    }
                    if (seal.mode) {
                        return true;
                    }
                    sendPacket(1, 0x13, 4, seal.type, 4, seal.gid);
                    delay(classid === 394 ? 1000 : 500);

                    if (!seal.mode) {
                        if (classid === 394
                                && Attack.validSpot(seal.x + 15, seal.y)) {
                            // de seis optimization
                            Pather.moveTo(seal.x + 15, seal.y, 3,
                                            Config.ClearType);
                        } else {
                            Pather.moveTo(seal.x - 5, seal.y - 5, 3,
                                            Config.ClearType);
                        }
                        delay(500);
                    } else {
                        return true;
                    }
                }

                return false;
            };

            this.getBoss = function (name) {
                var i, boss,
                    glow = getUnit(2, 131);

                for (i = 0; i < 16; i += 1) {
                    boss = getUnit(1, name);
                    if (boss) {
                        return Attack.clear(40, 0, name, this.sort);
                    }
                    delay(250);
                }

                return !!glow;
            };

            this.vizierSeal = function () {
                print("Viz layout " + this.vizLayout);
                this.followPath(this.vizLayout === 1 ?
                                    this.starToVizA : this.starToVizB);
                try {
                    this.openSeal(395);
                } catch (e1) {
                    print(e1);
                    delay(200);
                }
                try {
                    this.openSeal(396);
                } catch (e2) {
                    print(e2);
                    delay(200);
                }
                if (this.vizLayout === 1) {
                    Pather.moveTo(7691, 5292, 5, Config.ClearType);
                } else {
                    Pather.moveTo(7695, 5316, 5, Config.ClearType);
                }
                if (!this.getBoss(getLocaleString(2851))) {
                    this.getBoss(getLocaleString(2851));
                }

                return true;
            };

            this.seisSeal = function () {
                print("Seis layout " + this.seisLayout);
                this.followPath(this.seisLayout === 1 ?
                                this.starToSeisA : this.starToSeisB);
                try {
                    this.openSeal(394);
                } catch (e) {
                    print(e);
                    delay(200);
                }
                if (this.seisLayout === 1) {
                    Pather.moveTo(7771, 5196, 5, Config.ClearType);
                } else {
                    Pather.moveTo(7798, 5186, 5, Config.ClearType);
                }
                if (!this.getBoss(getLocaleString(2852))) {
                    this.getBoss(getLocaleString(2852));
                }

                return true;
            };

            this.infectorSeal = function () {
                print("Inf layout " + this.infLayout);
                this.followPath(this.infLayout === 1 ?
                                    this.starToInfA : this.starToInfB);
                try {
                    this.openSeal(392);
                } catch (e1) {
                    print(e1);
                }
                try {
                    this.openSeal(393);
                } catch (e2) {
                    print(e2);
                }
                if (this.infLayout === 1) {
                    delay(1);
                } else {
                    Pather.moveTo(7928, 5295, 5, Config.ClearType);// temp
                }
                if (!this.getBoss(getLocaleString(2853))) {
                    delay(500);
                    Attack.clear(40);
                    this.getBoss(getLocaleString(2853));
                }


                return true;
            };

            this.diabloPrep = function () {
                var trapCheck,
                    sorcSkill = [56, 59, 64],
                    tick = getTickCount();

                while (getTickCount() - tick < 60000) {
                    if (getTickCount() - tick >= 8000) {
                        switch (me.classid) {
                        case 1: // Sorceress
                            if (sorcSkill.indexOf(Config.AttackSkill[1]) > -1) {
                                if (me.getState(121)) {
                                    delay(500);
                                } else {
                                    Skill.cast(Config.AttackSkill[1], 0,
                                                7793, 5293);
                                }
                                break;
                            }
                            delay(500);
                            break;
                        case 3: // Paladin
                            Skill.setSkill(Config.AttackSkill[2]);
                            Skill.cast(Config.AttackSkill[1], 1);
                            break;
                        case 5: // Druid
                            if (Config.AttackSkill[1] === 245) {
                                Skill.cast(Config.AttackSkill[1], 0,
                                            7793, 5293);
                                break;
                            }
                            delay(500);
                            break;
                        case 6: // Assassin
                            if (Config.UseTraps) {
                                trapCheck = ClassAttack.checkTraps({x: 7793,
                                                                   y: 5293});
                                if (trapCheck) {
                                    ClassAttack.placeTraps(
                                        {x: 7793, y: 5293, classid: 243},
                                        trapCheck
                                    );
                                    break;
                                }
                            }
                            delay(500);
                            break;
                        default:
                            delay(500);
                            break;
                        }
                    } else {
                        delay(500);
                        Attack.clear(40);
                    }
                    if (getUnit(1, 243)) {
                        return true;
                    }
                }

                throw new Error("Diablo not found");
            };

            this.followPath = function (path) {
                var i,
                    cleared = [];

                for (i = 0; i < path.length; i += 2) {
                    if (cleared.length) {
                        this.clearStrays(cleared);
                    }
                    Pather.moveTo(path[i], path[i + 1], 5, Config.ClearType);
                    Attack.clear(30, 0, false, this.sort);
                    // Push cleared positions so they can be checked for strays
                    cleared.push([path[i], path[i + 1]]);
                    // After 5 nodes go back 3 nodes to check for monsters
                    if (i === 10 && path.length > 16) {
                        path = path.slice(6);
                        i = 0;
                    }
                }
            };

            this.clearStrays = function (cleared) {
                var i,
                    unit = getUnit(1);

                if (unit) {
                    do {
                        if (Attack.checkMonster(unit)) {
                            for (i = 0; i < cleared.length; i += 1) {
                                if (getDistance(unit, cleared[i][0],
                                                    cleared[i][1]) < 30
                                        && Attack.validSpot(unit.x, unit.y)) {
                                    Pather.moveToUnit(unit, 0, 0,
                                                        Config.ClearType);
                                    Attack.clear(20, 0, false, this.sort);
                                    break;
                                }
                            }
                        }
                    } while (unit.getNext());
                }

                return true;
            };

            // path coordinates
            this.entranceToStar = [7794, 5490, 7769, 5484, 7771, 5423,
                                    7782, 5413, 7767, 5383, 7772, 5324];
            this.starToVizA = [7766, 5306, 7759, 5295, 7734, 5295,
                                7716, 5295, 7718, 5276, 7697, 5292,
                                7678, 5293, 7665, 5276, 7662, 5314];
            this.starToVizB = [7766, 5306, 7759, 5295, 7734, 5295, 7716, 5295,
                                7701, 5315, 7666, 5313, 7653, 5284];
            this.starToSeisA = [7772, 5274, 7781, 5259, 7805, 5258,
                                7802, 5237, 7776, 5228, 7775, 5205,
                                7804, 5193, 7814, 5169, 7788, 5153];
            this.starToSeisB = [7772, 5274, 7781, 5259, 7805, 5258,
                                7802, 5237, 7776, 5228, 7811, 5218, 7807, 5194,
                                7779, 5193, 7774, 5160, 7803, 5154];
            this.starToInfA = [7815, 5273, 7809, 5268, 7834, 5306,
                                7852, 5280, 7852, 5310, 7869, 5294,
                                7895, 5295, 7919, 5290];
            this.starToInfB = [7815, 5273, 7809, 5268, 7834, 5306, 7852, 5280,
                                7852, 5310, 7869, 5294, 7895, 5274, 7927, 5275,
                                7932, 5297, 7923, 5313];

            var i,
                restart = true;


            //start
            Pather.teleport = true;
            for (i = 0; i < 10; i += 1) {
                if (me.getQuest(26, 0) || me.gametype) {
                    restart = false;
                    break;
                }
                delay(100 + me.ping);
            }

            if (Team.myType === Team.type.smurfette) {
                Pather.useWaypoint(107);
                Precast.doPrecast(true);
                // Pather.moveTo(7790, 5544);
                Pather.moveTo(7791, 5292);
                Pather.makePortal();
                Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
            } else if (!Team.waitTP(108)) {
                return true;
            }

            Attack.clear(10);
            this.initLayout();
            Util.startFollow();
            if (Team.myType !== Team.type.smurf) {
                // Pather.teleport = false;
                Attack.clear(30, 0, false, this.sort);
                Precast.doPrecast(true);
                delay(500);
                // this.followPath(this.entranceToStar);
                Attack.clear(30, 0, false, this.sort);
                this.vizierSeal();
                this.seisSeal();
                // Pather.teleport = true;
                Precast.doPrecast(true);
                delay(500);
                Team.inGame();
                this.infectorSeal();
            }
            Util.stopFollow();
            Pather.moveTo(7788, 5292, 5, Config.ClearType);

            Team.inGame();
            if (restart) {
                if (!Team.sync()) {
                    D2Bot.restart();
                }
                getScript("tools/toolsthread.js").stop();
            }
            try {
                Pather.makePortal();
                this.diabloPrep();
                Attack.kill(243);
            } catch (e) {
                print(e);
                Attack.clear(10);
                Town.goToTown();
                delay(30000); //pro!
                if (restart) {
                    D2Bot.restart();
                }
                return false;
            }
            Pickit.pickItems();
            if (restart) {
                D2Bot.restart();
            }

            delay(me.ping * 2 + 500);
            sendPacket(1, 0x40);
            delay(me.ping * 2 + 500);
            if ((me.getQuest(26, 1) || me.getQuest(26, 0)) && me.gametype) {
                Town.goToTown();
                Team.changeAct(5);
            }

            return Team.isLevel(SmurfConfig.diaLvl[me.diff]) && !!me.gametype;
        };

        Town.goToTown(4);
        if (!me.getQuest(25, 0) || me.getQuest(25, 1)) {
            if (Team.myType === Team.type.smurfette) {
                Util.travel(7);
            }
            return this.izual();
        }

        return this.diablo();
    },

    act5: function () {
        this.shenk = function () {
            Team.announce("shenk");

            if (Team.myType === Team.type.smurfette) {
                Pather.useWaypoint(111, true);
                Pather.makePortal();
                Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
            } else if (!Team.waitTP(111)) {
                return true;
            }
            Precast.doPrecast(true);
            delay(500);
            Pather.moveTo(3883, 5113, 5, Config.ClearType);
            Team.inGame();
            Pather.moveTo(3922, 5120, 5, Config.ClearType);
            try {
                Attack.kill(getLocaleString(22435)); // Shenk the Overseer
            } catch (e) {
                print(e);
            }
            Town.goToTown();

            return true;
        };

        this.rescueBarbs = function () {
            Team.announce("rescueBarbs");
            //(<3 Larryw)
            var i, j, unit, skill,
                coords = [],
                barbSpots = [];

            if (!me.getQuest(36, 1) && Team.myType === Team.type.smurfette) {
                Pather.teleport = true;
                Pather.useWaypoint(111, true);
                Precast.doPrecast(true);
                barbSpots = getPresetUnits(me.area, 2, 473);

                if (!barbSpots) {
                    return true;
                }
                for (i = 0; i < barbSpots.length; i += 1) {
                    coords.push({x: barbSpots[i].roomx * 5 + barbSpots[i].x,
                                y: barbSpots[i].roomy * 5 + barbSpots[i].y});
                }

                if (me.getSkill(45, 1) > me.getSkill(47, 1)
                        && me.getSkill(45, 1) > me.getSkill(49, 1)) {
                    skill = 45; //ice blast
                } else if (me.getSkill(47, 1) > me.getSkill(49, 1)) {
                    skill = 47; //fire ball
                } else if (me.getSkill(49, 1)) {
                    skill = 49; //lightning
                } else {
                    skill = 0; //normal attack
                }
                Config.PacketCasting = 1;

                for (i = 0; i < coords.length; i += 1) {
                    Pather.moveToUnit(coords[i], 2, 0);
                    Team.inGame();
                    unit = getUnit(1, 434); //door
                    if (unit) {
                        Pather.moveToUnit(unit, 1, 0);
                        for (j = 0; j < 10 && unit.hp; j += 1) {
                            Skill.cast(skill, 0, unit.x, unit.y);
                            delay(50);
                        }
                    }
                    delay(1500 + 2 * me.ping); //barb going to town...
                }
                Town.goToTown();
            }
            delay(1000 + me.ping);
            Util.talkTo("qual-kehk");

            return true;
        };

        this.anya = function () {
            Team.announce("anya");

            var unit, i;

            if (!me.getQuest(37, 1) && Team.myType === Team.type.smurfette) {
                Town.move("malah");
                unit = getUnit(1, "malah");
                if (unit) {
                    sendPacket(1, 0x31, 4, unit.gid, 4, 20127);
                        //FREE POT!(<3 Imba)
                    delay(me.ping);
                    sendPacket(1, 0x40);
                    delay(me.ping);
                }
                if (me.getItem(644) || me.getItem(646)) { //pot/scroll
                    if (!Town.openStash()) {
                        Town.openStash();
                    }
                    delay(me.ping);
                    if (me.getItem(644)) {
                        if (Storage.Stash.CanFit(me.getItem(644))) {
                            Storage.Stash.MoveTo(me.getItem(644));
                        }
                        delay(me.ping * 2 + 100);
                    }
                    if (me.getItem(646)) {
                        if (Storage.Stash.CanFit(me.getItem(646))) {
                            Storage.Stash.MoveTo(me.getItem(646));
                        }
                        delay(me.ping * 2 + 100);
                    }
                    me.cancel();
                }
                Pather.useWaypoint(113, true);
                Precast.doPrecast(true);
                Pather.teleport = true;
                Config.ClearType = false;
                Util.smurfToExit(114, true, Config.ClearType);
                if (me.area !== 114) {
                    Util.smurfToExit(114, true, Config.ClearType);
                }
                Team.inGame();
                unit = getPresetUnit(me.area, 2, 460);
                Pather.moveToUnit(unit);
                delay(me.ping + 850);
                sendPacket(1, 0x31, 4, 0xffffffff, 4, 20131);
                delay(me.ping + 50);
                unit = getUnit(2, 558); //anya
                if (unit) {
                    sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
                }
                me.cancel();
                Town.goToTown();
                Util.talkTo("malah");
            } else {
                Util.talkTo("malah");
                delay(1000 + me.ping);
                if (me.getQuest(37, 1)) { //inventory full workaround
                    Town.goToTown(4);
                    Town.doChores();
                    Town.goToTown(5);
                    Util.talkTo("malah");
                }
            }
            Town.goToTown(5);
            unit = me.getItem(646);
            if (unit) {
                clickItem(1, unit);
            }
            unit = getUnit(1, "anya");
            for (i = 0; i < 60 && !unit; i += 1) {
                delay(500);
                unit = getUnit(1, "anya");
            }
            Util.talkTo("anya");

            return true;
        };

        this.ancients = function () {
            Team.announce("ancients");

            var altar, i, j,
                boss = [22488, 22489, 22490]; //Korlic, Madawc, Talic

            Pather.teleport = true;
            Config.HPBuffer = 4;
            Config.MPBuffer = 4;
            Town.doChores();
            if (Team.myType === Team.type.smurfette) {
                Pather.useWaypoint(118, true);
                Util.smurfToExit(120, false);
                Pather.makePortal();
                Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
            } else if (!Team.waitTP(118)) {
                return true;
            }
            Precast.doPrecast(true);
            delay(500);

            Util.smurfToExit(120, true);

            Pather.moveTo(10048, 12634);
            Util.toggleChicken();
            altar = getUnit(2, 546);
            for (i = 0; i < 90 && !Team.inArea(); i += 1) {
                delay(1000);
            }

            if (altar && Team.myType === Team.type.bigSmurf) {
                Pather.moveToUnit(altar);
                Precast.doPrecast(true);
                delay(500 + me.ping * 3);
                sendPacket(1, 0x31, 4, altar.gid, 4, 20002);
                sendPacket(1, 0x13, 4, altar.type, 4, altar.gid);
                delay(100 + me.ping * 2);
                me.cancel();
            }
            while (!getUnit(1, 542)) {
                delay(250);
            }
            for (i = 0; i < 5; i += 1) {
                Team.inGame();
                for (j = 0; j < 3; j += 1) {
                    try {
                        Attack.kill(getLocaleString(boss[j]));
                    } catch (e) {
                        print(e);
                        Attack.clear(15);
                    }
                }
                delay(me.ping);
            }
            Attack.clear(50);

            delay(3000);
            me.cancel();
            Util.toggleChicken(true);
            if (Team.myType === Team.type.smurfette
                    && (me.getQuest(39, 0) || me.getQuest(39, 1))) {
                Util.smurfToExit([128, 129], true);
                Team.clickWP();
                Town.goToTown();
            } else {
                if (!Util.smurfToExit(118, true)) {
                    for (i = 0; i < 120
                            && !me.getQuest(39, 0) && !me.getQuest(39, 1);
                            i += 1) {
                        Attack.clear(40);
                        delay(500);
                    }
                }
                if (!Pather.usePortal(null)) {
                    Town.goToTown();
                }
            }

            return !!me.getQuest(39, 0) || !!me.getQuest(39, 1);
        };

        this.baal = function () {  //(<3 YGM)
            Team.announce("baal");

            this.preattack = function () {
                var check;

                switch (me.classid) {
                case 1: // Sorceress
                    switch (Config.AttackSkill[1]) {
                    case 49:
                    case 53:
                    case 56:
                    case 59:
                    case 64:
                        if (me.getState(121)) {
                            while (me.getState(121)) {
                                delay(100);
                            }
                        } else {
                            return Skill.cast(Config.AttackSkill[1], 0,
                                                15090 + rand(-5, 5), 5026);
                        }

                        break;
                    }

                    break;
                case 3: // Paladin
                    if (Config.AttackSkill[3] === 112) {
                        if (Config.AttackSkill[4] > 0) {
                            Skill.setSkill(Config.AttackSkill[4], 0);
                        }

                        return Skill.cast(Config.AttackSkill[3], 1);
                    }

                    break;
                case 5: // Druid
                    if (Config.AttackSkill[3] === 245) {
                        return Skill.cast(Config.AttackSkill[3], 0,
                                            15094 + rand(-1, 1), 5028);
                    }

                    break;
                case 6: // Assassin
                    if (Config.UseTraps) {
                        check = ClassAttack.checkTraps({x: 15094, y: 5028});

                        if (check) {
                            return ClassAttack.placeTraps({x: 15094,
                                                           y: 5028}, 5);
                        }
                    }

                    if (Config.AttackSkill[3] === 256) { // shock-web
                        return Skill.cast(Config.AttackSkill[3], 0,
                                            15094, 5028);
                    }

                    break;
                }

                return false;
            };

            this.checkThrone = function () {
                var monster = getUnit(1);

                if (monster) {
                    do {
                        if (Attack.checkMonster(monster)
                                && monster.y < 5080) {
                            switch (monster.classid) {
                            case 23:
                            case 62:
                                return 1;
                            case 105:
                            case 381:
                                return 2;
                            case 557:
                                return 3;
                            case 558:
                                return 4;
                            case 571:
                                return 5;
                            default:
                                Attack.getIntoPosition(monster, 10, 0x4);
                                Attack.clear(15);

                                return false;
                            }
                        }
                    } while (monster.getNext());
                }

                return false;
            };

            this.clearThrone = function () {
                var i, monster,
                    monList = [],
                    pos = [15094, 5022, 15094, 5041, 15094, 5060,
                            15094, 5041, 15094, 5022];

                //avoid dolls
                monster = getUnit(1, 691);

                if (monster) {
                    do {
                        if (monster.x >= 15072 && monster.x <= 15118
                                && monster.y >= 5002 && monster.y <= 5079
                                && Attack.checkMonster(monster)
                                && Attack.skipCheck(monster)) {
                            monList.push(copyUnit(monster));
                        }
                    } while (monster.getNext());
                }

                if (monList.length) {
                    Attack.clearList(monList);
                }

                for (i = 0; i < pos.length; i += 2) {
                    Pather.moveTo(pos[i], pos[i + 1]);
                    Attack.clear(25);
                }
            };

            this.checkHydra = function () {
                var monster = getUnit(1, "hydra");
                if (monster) {
                    do {
                        if (monster.mode !== 12 && monster.getStat(172) !== 2) {
                            if (Team.myType === Team.type.smurfette) {
                                Pather.moveTo(15072, 5002);
                            } else {
                                Pather.moveTo(15118, 5002);
                            }
                            while (monster.mode !== 12) {
                                delay(500);
                                if (!copyUnit(monster).x) {
                                    break;
                                }
                            }

                            break;
                        }
                    } while (monster.getNext());
                }

                return true;
            };

            var portal, tick, i,
                merc = false,
                restart = true;

            for (i = 0; i < 10; i += 1) {
                if (me.getQuest(40, 0)) {
                    restart = false;
                    break;
                }
                delay(100 + me.ping);
            }

            if (Team.myType === Team.type.smurfette) {
                try {
                    Pather.useWaypoint(129);
                } catch (e1) {
                    print(e1);
                    Util.travel(9);
                }
                if (Team.isLevel(SmurfConfig.walkBaalLvl[me.diff])) {
                    Pather.teleport = true;
                    Util.smurfToExit([130, 131], true);
                    Pather.moveTo(15095, 5029);
                    Pather.moveTo(15118, 5002);
                }
                Pather.makePortal();
                Team.sendMsg(Team.type.smurf | Team.type.bigSmurf, "come");
            } else {
                if (Team.isLevel(SmurfConfig.walkBaalLvl[me.diff])) {
                    Pather.teleport = true;
                    if (!Team.waitTP(131)) {
                        return true;
                    }
                } else if (!Team.waitTP(129)) {
                    return true;
                }
            }

            while (me.area !== 131) { //walking
                Precast.doPrecast(true);
                delay(500);
                if (me.area === 129 || me.area === 130) {
                    if (!Util.smurfToExit(me.area + 1, true,
                                            Config.ClearType)) {
                        Town.goToTown();
                    }
                } else {
                    Town.goToTown();
                    Town.move("portalspot");
                    Team.sendMsg(Team.type.smurfette | Team.type.bigSmurf,
                                    "tp");
                    delay(1000);
                    if (!Pather.usePortal(131) && !Pather.usePortal(130)
                            && !Pather.usePortal(129)) {
                        delay(1000);
                    }
                }
            }
            if (!Team.isLevel(SmurfConfig.walkBaalLvl[me.diff])) {
                Pather.moveTo(15124, 5243, 5, Config.ClearType);
                Pather.moveTo(15095, 5029, 5, Config.ClearType);
            }

            Pather.teleport = true;
            Attack.clear(15);
            this.clearThrone();
            tick = getTickCount();
            Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038, 5,
                            Config.ClearType);
            Precast.doPrecast(true);

BaalLoop:
            while (true) {
                if (me.classid === 3 || me.classid === 4) {
                    Pather.moveTo(15094, 5029);
                } else if (Team.myType === Team.type.smurfette) {
                    Pather.moveTo(15094, 5038);
                }
                if (!getUnit(1, 543)) {
                    break BaalLoop;
                }

                switch (this.checkThrone()) {
                case 1:
                    Attack.clear(40);
                    tick = getTickCount();
                    Precast.doPrecast(true);
                    break;
                case 2:
                    Attack.clear(40);
                    tick = getTickCount();
                    break;
                case 3:
                    Attack.clear(40);
                    this.checkHydra();
                    tick = getTickCount();
                    break;
                case 4:
                    Attack.clear(40);
                    tick = getTickCount();
                    break;
                case 5:
                    Attack.clear(40);
                    if (me.charlvl > 65 && me.diff === 1) {
                        for (i = 0; i < 5 && !merc; i += 1) {
                            merc = me.getMerc();
                            delay(100 + me.ping);
                        }
                        if (merc && !merc.getState(43)) {
                            Town.goToTown();
                            Util.hireMerc(1);
                            Town.goToTown(5);
                            Town.move("portalspot");
                            if (!Pather.usePortal(131, me.name)) {
                                return false;
                            }
                        }
                    }
                    break BaalLoop;
                default:
                    if (getTickCount() - tick < 7e3) {
                        if (me.getState(2)) {
                            Skill.setSkill(109, 0);
                        }
                        break;
                    }
                    if (!this.preattack()) {
                        delay(100);
                    }
                }
                delay(10);
            }

            sendPacket(1, 0x40);
            delay(me.ping * 2);
            if (!SmurfConfig.killBaal) {
                return false;
            }

            Pather.moveTo(15090, 5008, 5, Config.ClearType);
            delay(5000);
            Precast.doPrecast(true);
            while (getUnit(1, 543)) {
                delay(500);
                Attack.clear(50);
            }
            portal = getUnit(2, 563);
            if (portal) {
                Pather.usePortal(null, null, portal);
            } else {
                print("portal not found");
                if (restart) {
                    D2Bot.restart();
                }
                return false;
            }
            Team.inGame();
            for (i = 0; i < 42 && restart && !Team.inArea(); i += 1) {
                if (i > 30) {
                    D2Bot.restart();
                }
                Attack.clear(10);
                delay(1000);
            }
            if (restart) {
                getScript("tools/toolsthread.js").stop();
            }
            Pather.moveTo(15134, 5923);
            try {
                Attack.kill(544); // Baal
            } catch (e) {
                delay(10000);
                print(e);
            }
            Pickit.pickItems();
            if (restart) {
                D2Bot.restart(); //avoid congrat screen
            }

            return false;
        };

        Town.goToTown(5);
        if (Team.myType === Team.type.smurfette && !me.getQuest(39, 0)) {
            Util.travel(8);
        }
        if (!me.getQuest(35, 1) && !me.getQuest(35, 0)) {
            return this.shenk();
        }
        if (!me.getQuest(36, 0) || me.getQuest(36, 1)) {
            return this.rescueBarbs();
        }
        if (!me.getQuest(37, 0) || me.getQuest(37, 1)) {
            return this.anya();
        }
        if (!me.getQuest(39, 0)) {
            return this.ancients();
        }
        if (me.charlvl === 42) {
            Util.hireMerc(1);
        }
        if (Team.myType === Team.type.smurfette && !me.getQuest(40, 0)) {
            Util.travel(9);
        }
        return this.baal();
    },

    //return false if quit is needed, otherwise true
    launch: function () {
        var tome;

        sendPacket(1, 0x40); //refresh quest state
        delay(100 + me.ping * 2);
        Team.inGame();
        Pather.teleport = false;
        Config.ClearType = 0;
        tome = me.findItem("tbk", 0, 3);
        Util.toggleChicken(tome && tome.getStat(70));

        if (Msg.action === "broken") {
            return this.act1();
        }
        if (Team.myType === Team.type.smurfette) {
            Team.sendMsg(Team.type.all, "0");
        }

        if (!me.getQuest(7, 0)) {
            return this.act1();
        }
        if (!me.getQuest(15, 0)) {
            return this.act2();
        }
        if (!me.getQuest(23, 0)) {
            return this.act3();
        }
        if (!me.getQuest(28, 0) || !me.gametype
                || !Team.isLevel(SmurfConfig.diaLvl[me.diff])) {
            return this.act4();
        }
        return this.act5();
    }
};

function AutoSmurf() {
    addEventListener("copydata", function (mode, msg) {
        print("msg: " + msg + " mode: " + mode); //debug

        switch (mode) {
        case 100: //action
            switch (msg) {
            case "inc":
                Msg.x += 1;
                break;
            case "ping":
                if (Msg.y === 1) { //ready
                    Team.sendMsg(Team.type.bigSmurf, "inc"); //pong
                }
                break;
            case "update":
                if (!me.inTown && getTickCount() - Msg.timer > 1000) {
                    Msg.timer = getTickCount();
                    Team.sendMsg(Team.type.smurf, "",
                                    me.targetx, me.targety, me.area);
                }
                break;
            case "tp":
                if (me.area !== 120 && !me.inTown
                        && getTickCount() - Msg.timer > 1000) {
                    Msg.timer = getTickCount();
                    Pather.makePortal();
                }
                break;
            case "mephTP":
                if (Team.myType === Team.type.smurfette && !Msg.area) {
                    Msg.area = 1;
                    delay(3000);
                    Team.act3to4();
                    Msg.area = 0;
                }
                break;
            case "askGold":
                if ((me.getStat(14) + me.getStat(15)) > 2 * Config.LowGold) {
                    Team.sendMsg(Team.type.all, "giveGold");
                    Msg.action = "dropGold";
                }
                break;
            case "giveGold":
                if (me.getStat(14) + me.getStat(15) < Config.LowGold) {
                    Msg.action = "pickGold";
                }
                break;
            default:
                Msg.action = msg;
            }
            break;
        case 101: //x
            Msg.x = parseInt(msg, 10);
            break;
        case 102: //y
            Msg.y = parseInt(msg, 10);
            break;
        case 103: //area
            Msg.area = parseInt(msg, 10);
            break;

        case 104: //wpSharing (greater saved in Msg.area)
            if (parseInt(msg, 10) > Msg.area) {
                Msg.area = parseInt(msg, 10);
            }
            break;

        case 105: //init Team.names
            if (msg[0] === "*") {
                Team.names.unshift(msg.substring(1)); //bigSmurf 0
            } else if (msg[0] === "$") {
                Team.names.splice(1, 0, msg.substring(1)); //smurfette 1
            } else {
                Team.names.push(msg);
            }
            break;
        }
    });

    addEventListener("chatmsg", function (nick, msg) {
        var hello = ["hi", "yo", "hey", "hello", "sup"];

        if (/(\W+|^)(tp|portal|townportal|bo)(\W+|$)/i.test(msg)
                && me.area !== 120 && !me.inTown) {
            if (getTickCount() - Msg.timer > 5000) {
                Msg.timer = getTickCount();
                Pather.makePortal();
                say("here you go :)");
            } else {
                say("nop :/ maybe later?");
            }
        } else if (/(\W+|^)bo(\W+|$)/i.test(msg)
                && Team.myType === Team.type.bigSmurf && !me.inTown) {
            if (getTickCount() - Msg.timer > 5000) {
                Msg.timer = getTickCount();
                say("come...");
                say("!here! :D");
                delay(1000);
                Precast.doPrecast(true);
            } else {
                say("nop :/ maybe later?");
            }
        } else if (Team.names.length > 0 && Team.names.indexOf(nick) === -1) {
            if (Team.myType === Team.type.bigSmurf && nick !== me.name &&
                    /(\W+|^)(hi|yo|hey|hello|sup)(\W+|$)/i.test(msg)) {
                delay(rand(1000, 3000));
                say(hello[rand(0, hello.length - 1)]);
            } else if (Team.myType === Team.type.smurfette &&
                    /(\W+|^)(help|please|fuck|shit|damn)(\W+|$)/i.test(msg)) {
                say("DON'T PANIC!");
            }
        } else if (!(getTickCount() % 5) && Team.names.indexOf(nick) === -1
                && Team.myType === Team.type.bigSmurf) {
            say("Yeah well sorry, I'm just a smurf... I mean, an AutoSmurf!");
        }
    });

    if (Team.init()) {
        while (Quest.launch()) {
            me.overhead("smurf");
            delay(500 + me.ping * 2);
        }
    }
}