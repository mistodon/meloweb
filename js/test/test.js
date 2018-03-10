const melo = require("../dist/melo.js");
const assert = require("assert");

describe('melo', function() {
  describe('compile_melo_to_base64', function() {
    it('exists and is a function', function() {
      assert.equal(typeof(melo.compile_melo_to_base64), "function");
    });

    it('returns a string', async function() {
      const result = await melo.compile_melo_to_base64("");
      assert.equal(typeof(result), "string");
    });

    it('compiles an empty program', async function() {
      const result = await melo.compile_melo_to_base64("");
      assert.equal(result, "TVRoZAAAAAYAAQABAeBNVHJrAAAAJwD/AQpub3RlIHRyYWNrAP9RAwehIAD/WQIAAAD/WAQEAjAIAP8vAA==");
    })

    it('compiles an empty voice', async function() {
      const result = await melo.compile_melo_to_base64("voice A {}");
      assert.equal(result, "TVRoZAAAAAYAAQACAeBNVHJrAAAAJwD/AQpub3RlIHRyYWNrAP9RAwehIAD/WQIAAAD/WAQEAjAIAP8vAE1UcmsAAAAZAP8BCm5vdGUgdHJhY2sBwAAAsAd/AP8vAA==");
    })

    it('compiles an empty voice and empty play block', async function() {
      const result = await melo.compile_melo_to_base64("voice A {} play A {}");
      assert.equal(result, "TVRoZAAAAAYAAQACAeBNVHJrAAAAJwD/AQpub3RlIHRyYWNrAP9RAwehIAD/WQIAAAD/WAQEAjAIAP8vAE1UcmsAAAAZAP8BCm5vdGUgdHJhY2sBwAAAsAd/AP8vAA==");
    })

    it('compiles a configured voice and empty play block', async function() {
      const result = await melo.compile_melo_to_base64("voice A { program: 29 } play A {}");
      assert.equal(result, "TVRoZAAAAAYAAQACAeBNVHJrAAAAJwD/AQpub3RlIHRyYWNrAP9RAwehIAD/WQIAAAD/WAQEAjAIAP8vAE1UcmsAAAAZAP8BCm5vdGUgdHJhY2sBwB0AsAd/AP8vAA==");
    })

    it('compiles an empty voice playing one note', async function() {
      const result = await melo.compile_melo_to_base64("voice A {} play A { :| A }");
      assert.equal(result, "TVRoZAAAAAYAAQACAeBNVHJrAAAAJwD/AQpub3RlIHRyYWNrAP9RAwehIAD/WQIAAAD/WAQEAjAIAP8vAE1UcmsAAAAiAP8BCm5vdGUgdHJhY2sBwAAAsAd/AJA5aY5/gDkAAP8vAA==");
    })

    it('compiles a complex example', async function() {
      const result = await melo.compile_melo_to_base64("voice A { volume: 50, program: 48 } play A { :| A C E ; :| C E G }");

      assert.equal(result, "TVRoZAAAAAYAAQACAeBNVHJrAAAAJwD/AQpub3RlIHRyYWNrAP9RAwehIAD/WQIAAAD/WAQEAjAIAP8vAE1UcmsAAABMAP8BCm5vdGUgdHJhY2sBwDAAsAcyAJA5aQCQPGmEf4A5AACAPAABkDxfAJBAX4R/gDwAAIBAAAGQQF8AkENfhH+AQAAAgEMAAP8vAA==");
    })
  });
});
