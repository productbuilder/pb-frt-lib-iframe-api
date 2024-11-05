describe("Creating an app", function() {
    // set up test structure
    // div inside body with
    // a span, div, iframe etc

    it("Should throw for a missing element id", function() {
        expect(function() {
            const app = PB.App();
        }).to.throw();
    });
    it("Should throw for an invalid element id", function() {
        expect(function() {
            const app = PB.App("no-such-id");
        }).to.throw();
    });
    it("Should throw for an invalid element type", function() {
        const bodyId = "body-" + Math.random();
        document.body.id = bodyId;
        expect(function() {
            const app = PB.App(bodyId, {});
        }).to.throw();
    });
    it("Should throw for a missing app data without existing iframe", function() {
        const div = document.createElement("div");
        const divId = "div-" + Math.random();
        div.id = divId;
        expect(function() {
            const app = PB.App(divId);
        }).to.throw();
    });
    it("Should connect to an app when the id belongs to a PB iframe", function() {
        const app = PB.App(iframeId);
    });
    it("Should create an app when the id belongs to a div", function() {
        const app = PB.App(divId, { packageId: "" });
    });
    describe("App Data", function() {
        it(
            "Should throw when missing a pkg id and manufacturer name + product name",
        );
    });
});

describe("App", function() {
    it("Can load a project");
    it("Can create a project");
    describe("Events", function() {
    });
    describe("Status", function() {
        it("Can be read");
        it("Is an event");
    });
    describe("Options", function() {
        it("Can be read globally, from all Configurations at once");
        it(
            "Any valid option from any Configurator in the Project can be applied at the root level",
        );
    });
});
describe("Project", function() {
    it("Can be saved");
    it("Can have Spaces, that can be read");
    it("Can add Spaces");
    it("Can remove unlinked Spaces");
    it("Can not remove linked Spaces");
    it("Can have Designs, that can be read");
    it("Can add Designs");
    it("Can remove Designs");
    it("Has an Undo");
    it("Has an Redo");
});
describe("Space", function() {
    it("Can be read");
    it("Can be updated");
});
describe("Design", function() {
    it("Can have Configurators, which can be read");
    it("Can add Configurators");
    it("Can remove Configurators");
    it("Can have Variants for Configurators");
    it("Has an Undo");
    it("Has an Redo");
});
describe("Configurator", function() {
    it("Is in a Configuration that can be read");
    it("Can load any valid Configuration, such as a preset");
    it("Can apply a preset, while ignoring its materials");
    it("Has an Undo");
    it("Has an Redo");
});
describe("Configuration", function() {
    it("Has Options");
    it("Can apply an Option");
});
describe("Option", function() {
    it("Belongs to a Configurator");
    it("Is either a Block option or a Material option");
    it("Has a thumbnail");
});
