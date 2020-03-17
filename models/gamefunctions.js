const db = require("./con");

class Functions {
  constructor() {}
  static async incrementInfection(oldNumber, teamsID) {
    try {
      const newNumber = oldNumber + 1;
      const value = await db.one(
        `UPDATE game SET outbreak = ${newNumber} FROM teams WHERE game.id = ${teamsID};`
      );
      return value;
    } catch (e) {
      return e;
    }
  }

  static async decreaseDay(teamID) {
    try {
      const response = await db.one(
        `UPDATE game SET death_countdown = death_countdown - 1 WHERE game.id = ${teamID};`
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  static async setOutbreak(number, teamsID) {
    const value = await db.one(
      `UPDATE game SET outbreak = ${number} WHERE game.id = ${teamsID} RETURNING id;;`
    );
  }

  static async getInfection(teamsID) {
    try {
      const response = await db.one(
        `SELECT game.infectrate FROM game WHERE game.id = ${teamsID};`
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  static async getOutbreak(teamsID) {
    try {
      const response = await db.one(
        `SELECT game.outbreak FROM game WHERE game.id = ${teamsID};`
      );
      return response.outbreak;
    } catch (e) {
      return e;
    }
  }

  //game checks.

  async checkOutbreak(teamsID) {
    //
    try {
      const outbreak = await Functions.getOutbreak(teamsID);
      //   if statement. Need outbreak added to the database.
      if (outbreak === 8) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return e;
    }
  }

  static async getCures(teamsID) {
    try {
      const cure1 = await db.one(
        `SELECT cure1 FROM game WHERE game.id = ${teamsID}`
      );
      const cure2 = await db.one(
        `SELECT cure2 FROM game WHERE game.id = ${teamsID}`
      );
      const cure3 = await db.one(
        `SELECT cure3 FROM game WHERE game.id = ${teamsID}`
      );
      const cure4 = await db.one(
        `SELECT cure4 FROM game WHERE game.id = ${teamsID}`
      );
      const cureArray = [cure1.cure1, cure2.cure2, cure3.cure3, cure4.cure4];
      return cureArray;
    } catch (e) {
      return e;
    }
  }

  async checkCures(teamsID) {
    const cureArray = await Functions.getCures(teamsID);
    console.log(cureArray);

    for (let i = 0; i < cureArray.length; i++) {
      if (cureArray[i] === false) {
        i = 5;
        return false;
      } else {
      }
    }
    return true;
  }

  static async getDeck(teamsID) {
    try {
      const response = await db.one(
        `SELECT playerdeck FROM game WHERE game.id = ${teamsID};`
      );
      return response.playerdeck;
    } catch (e) {
      return e;
    }
  }

  async checkDeck(teamID) {
    //return true if deck is empty.
    const deck = await Functions.getDeck(teamID);
    if (deck.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  async getCureCountdown(teamID) {
    try {
      const response = await db.one(
        `SELECT cure_countdown FROM game WHERE game.id = $1`,
        [teamID]
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  async getDeathCountdown(teamID) {
    try {
      const response = await db.one(
        `SELECT death_countdown FROM game WHERE game.id = $1`,
        [teamID]
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  static async increaseCureCountdown(teamID) {
    try {
      const response = await db.one(
        `UPDATE game SET cure_countdown = cure_countdown + 1 WHERE id = ${teamID};`
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  async postCureProperty(teamID, increaseValue) {
    try {
      const update = await db.one(
        `UPDATE game SET cure_countdown = $1 WHERE id = $2;`,
        [increaseValue, teamID]
      );
      return update;
    } catch (e) {
      return e;
    }
  }

  async getWins(teamID) {
    try {
      const wins = await db.one(`SELECT win FROM score WHERE id = $1`, [
        teamID
      ]);
      return wins.win;
    } catch (e) {
      return e;
    }
  }

  async getlosses(teamID) {
    try {
      const loss = await db.one(
        `SELECT loss FROM score JOIN teams ON teams.id = score.id WHERE teams.id = $1;`,
        [teamID]
      );
      return loss.loss;
    } catch (e) {
      return e;
    }
  }

  static async updateWin(teamID) {
    try {
      const newWins = await db.one(
        `UPDATE score SET win = win + 1 WHERE score.id = $1;`,
        [teamID]
      );
      return newWins;
    } catch (e) {
      return e;
    }
  }

  static async updatelosses(teamID) {
    try {
      const newlosses = await db.one(
        `UPDATE score SET loss = loss + 1 WHERE score.id = $1`,
        [teamID]
      );
      return newlosses;
    } catch (e) {
      return e;
    }
  }
}

module.exports = Functions;
