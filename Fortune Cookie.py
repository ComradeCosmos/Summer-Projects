import random

fortunes = [
    "A beautiful, smart, and loving person will be coming into your life.",
    "Your luck is about to change.",
    "The early bird gets the worm.",
    "Don't just think. Act!",
    "Someone in your life needs a letter from you."
]

def get_fortune():
    return random.choice(fortunes)

print("Your fortune is:", get_fortune())
