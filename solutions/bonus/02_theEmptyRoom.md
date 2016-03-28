# 02_theEmptyRoom.md

## Iterative Approach
Oh, just classic Fibonacci number formula
```javascript
        var sum = 1;
        var last = 1;
        var last2 = 1;
        for (var i = 3; i <= input; i++) {
            sum = last + last2;
            last2 = last;
            last = sum;
        }
        return sum;
```

### urandon: admin's privilege
What if you are an admin?
```javascript
        throw 'root#term: access granted';
```
