/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * for property constraint violations
 * @person Gerd Wagner
 */

class ConstraintViolation {
    constructor(msg) {
        this.message = msg;
    }
}

class NoConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
        this.message = "";
    }
}

class MandatoryValueConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class RangeConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class PatternConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class UniquenessConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}