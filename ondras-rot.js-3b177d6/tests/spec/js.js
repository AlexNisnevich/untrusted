describe("JS", function() {
	describe("String", function() {
		describe("::capitalize", function() {
			it("should capitalize first letter", function() {
				expect("abc".capitalize()).toBe("Abc");
				expect("Abc".capitalize()).toBe("Abc");
			});
		});
		describe(".format", function() {
			it("should not replace when not requested", function() {
				expect(String.format("aaa bbb ccc")).toBe("aaa bbb ccc");
			});

			it("should ignore double-percents", function() {
				expect(String.format("%%s")).toBe("%s");
			});

			it("should replace %s by default", function() {
				expect(String.format("a %s c", "b")).toBe("a b c");
			});

			it("should replace multiple arguments", function() {
				expect(String.format("a %s,%s,x", "b", "c")).toBe("a b,c,x");
			});

			it("should ignore remaining arguments", function() {
				expect(String.format("a %s c", "b", "c")).toBe("a b c");
			});

			it("should skip missing arguments", function() {
				expect(String.format("a %s %s", "b")).toBe("a b %s");
			});

			it("should use braces", function() {
				expect(String.format("%{s}ss", "b")).toBe("bss");
				expect(String.format("%s}ss", "b")).toBe("b}ss");
				expect(String.format("%{s ss", "b")).toBe("%{s ss");
			});

			it("should capitalize when requested", function() {
				expect(String.format("a %S", "b")).toBe("a B");
			});

			it("should perform custom mapping", function() {
				var oldMap = String.format.map;
				String.format.map = {
					s: "test1",
					xxx: "test2"
				}
				var obj = {
					test1:function() { return "foo"; },
					test2:function() { return "bar"; },
				}
				expect(String.format("%s %S %x %xxx %Xxx %XXX", obj, obj, obj, obj, obj)).toBe("foo Foo %x bar Bar Bar");
				String.format.map = oldMap;
			});

			it("should pass params", function() {
				var oldMap = String.format.map;
				String.format.map = { foo: "foo" };
				var obj = {
					foo:function($) { return $+$; }
				}
				expect(String.format("%{foo,bar}", obj)).toBe("barbar");
				String.format.map = oldMap;
			});
		});
		describe("::format", function() {
			it("should replace formatting strings", function() {
				expect("%s %s".format(1, 2, 3)).toBe("1 2");
			});
			it("should ignore double-percents", function() {
				expect("%%s".format(1, 2, 3)).toBe("%s");
			});
		});
		describe("::lpad", function() {
			it("should lpad with defaults", function() {
				expect("a".lpad()).toBe("0a");
			});
			it("should lpad with char", function() {
				expect("a".lpad("b")).toBe("ba");
			});
			it("should lpad with count", function() {
				expect("a".lpad("b", 3)).toBe("bba");
			});
			it("should not lpad when not necessary", function() {
				expect("aaa".lpad("b", 3)).toBe("aaa");
			});
		});
		describe("::rpad", function() {
			it("should rpad with defaults", function() {
				expect("a".rpad()).toBe("a0");
			});
			it("should rpad with char", function() {
				expect("a".rpad("b")).toBe("ab");
			});
			it("should rpad with count", function() {
				expect("a".rpad("b", 3)).toBe("abb");
			});
			it("should not rpad when not necessary", function() {
				expect("aaa".rpad("b", 3)).toBe("aaa");
			});
		});
	});

	describe("Date", function() {
		describe("now", function() {
			it("should return current timestamp", function() {
				expect(typeof(Date.now())).toBe("number");
				expect(Date.now()).toBeGreaterThan(0);
			});
		});
	});

	describe("Number", function() {
		describe("mod", function() {
			it("should compute modulus of a positive number", function() {
				expect((7).mod(3)).toBe(1);
			});
			it("should compute modulus of a negative number", function() {
				expect((-7).mod(3)).toBe(2);
			});
		});
	});

	describe("Function", function() {
		describe("create", function() {
			it("should create a proper child-parent binding", function() {
				var Parent = function() {};
				Parent.prototype.a = 3;
				var Child = function() {};
				Child.extend(Parent);
				var child = new Child();
				expect(child.a).toBe(3);
				expect(child.constructor).toBe(Child);
			});
		});
	});

	describe("Object", function() {
		describe("create", function() {
			it("should create a proper prototype chain", function() {
				var parent = {a:3};
				var child = Object.create(parent);
				expect(child.a).toBe(3);
				expect(child).not.toBe(parent);
			});
		});
	});
});
