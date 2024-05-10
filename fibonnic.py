def fib(n):
    if n <= 1:
        return n
    
    previousPrevious = 0
    previous = 1
    current = 0
    i = 1
    while i < n:
        current = previousPrevious + previous
        previousPrevious = previous
        previous = current
        i += 1
    
    return current





if __name__ == "__main__":

    print(fib(6))
