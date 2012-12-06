describe("Command.Preprocessor", function() {
    var preprocessor = Ext.create('Command.Preprocessor');

    beforeEach(function() {
        preprocessor.setParams({
            browser: 'ie',
            browserVersion: 6,
            version: 3.1,
            minVersion: 2.0,
            debug: true
        });
    });

    describe("evaluate()", function() {
        it("Browser is IE", function() {
            expect(preprocessor.evaluate('browser', 'ie')).toBe(true);
        });

        it("Browser is not firefox", function() {
            expect(preprocessor.evaluate('browser', '!firefox')).toBe(true);
        });

        it("Browser version is greater than 5", function() {
            expect(preprocessor.evaluate('browserVersion', '>5')).toBe(true);
        });

        it("Browser version is less than 7", function() {
            expect(preprocessor.evaluate('browserVersion', '<7')).toBe(true);
        });

        it("Browser version is greater or equal to 6", function() {
            expect(preprocessor.evaluate('browserVersion', '>=6')).toBe(true);
        });

        it("Nonexistent", function() {
            expect(preprocessor.evaluate('nonexistent')).toBe(false);
        });
    });

    describe("isStatement()", function() {
        it("//<if browser=ie> is a valid statement", function() {
            expect(preprocessor.isStatement('//<if browser=ie>')).toBe(true);
        });

        it("    //<if browser=ie> (tab in front) is a valid statement", function() {
            expect(preprocessor.isStatement('    //<if browser=ie>')).toBe(true);
        });

        it("//<if browser=ie> (spaces at the end) is a valid statement", function() {
            expect(preprocessor.isStatement('//<if browser=ie>      ')).toBe(true);
        });

        it("//</if> is not a valid opening statement", function() {
            expect(preprocessor.isStatement('//</if>')).toBe(false);
        });
    });

    describe("isCloseOf()", function() {
        it("//</if> is valid close of if", function() {
            expect(preprocessor.isCloseOf('//</if>', { type: 'if', isInverted: false })).toBe(true);
        });

        it("//</!if> is valid close of inverted if", function() {
            expect(preprocessor.isCloseOf('//</!if>', { type: 'if', isInverted: true })).toBe(true);
        });
    });

    describe("parseStatementProperties()", function() {
        it("'browser=ie debug' => { browser: 'ie', debug: true }", function() {
            expect(preprocessor.parseStatementProperties('browser=ie debug')).toEqual({ browser: 'ie', debug: true });
        });

        it("'browser=\"ie\" browserVersion='!7' debug=false' " +
                "=> { browser: 'ie', browserVersion: '!7', debug: \"false\" }", function() {
            expect(preprocessor.parseStatementProperties('browser="ie" browserVersion=\'!7\' debug=false')).toEqual({
                browser: 'ie',
                browserVersion: '!7',
                debug: "false"
            });
        });
    });

    describe("parseStatement()", function() {
        it("//<deprecated since=\"3.0\"> => { properties: { since: '3.0' }, type: 'deprecated', isInverted: false }", function() {
            expect(preprocessor.parseStatement('//<deprecated since="3.0">')).toEqual({
                properties: { since: '3.0' },
                type: 'deprecated',
                isInverted: false
            });
        });
    });
});
