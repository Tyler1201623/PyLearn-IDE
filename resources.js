/**
 * PyLearn IDE Resources Module
 * Provides documentation, tutorials and learning resources for Python
 */

class ResourceManager {
    constructor() {
        this.initialized = false;
        this.resources = {};
        this.currentCategory = null;
    }
    
    initialize() {
        if (this.initialized) return;
        
        // Set up resources data
        this.setupResources();
        
        // Add event listeners
        document.getElementById('resourcesPanel').querySelector('.resources-header button').addEventListener('click', () => {
            this.hidePanel();
        });
        
        this.initialized = true;
    }
    
    setupResources() {
        // Define available resources
        this.resources = {
            basics: {
                title: "Python Basics",
                resources: [
                    {
                        title: "Variables & Data Types",
                        content: `
                            <h3>Variables & Data Types</h3>
                            <p>Python has several built-in data types:</p>
                            <ul>
                                <li><strong>Numeric Types:</strong> int, float, complex</li>
                                <li><strong>Text Type:</strong> str</li>
                                <li><strong>Sequence Types:</strong> list, tuple, range</li>
                                <li><strong>Mapping Type:</strong> dict</li>
                                <li><strong>Set Types:</strong> set, frozenset</li>
                                <li><strong>Boolean Type:</strong> bool</li>
                                <li><strong>None Type:</strong> NoneType</li>
                            </ul>
                            <h4>Example:</h4>
                            <pre>
# Integer
age = 25

# Float
height = 1.75

# String
name = "Python Learner"

# Boolean
is_student = True

# List (mutable)
languages = ["Python", "JavaScript", "Go"]

# Tuple (immutable)
coordinates = (10.5, 20.8)

# Dictionary (key-value pairs)
person = {
    "name": "Alice",
    "age": 30,
    "is_student": False
}

# Checking types
print(type(age))       # <class 'int'>
print(type(name))      # <class 'str'>
print(type(languages)) # <class 'list'>
                            </pre>
                        `
                    },
                    {
                        title: "Control Flow",
                        content: `
                            <h3>Control Flow Statements</h3>
                            <p>Python provides several control flow statements:</p>
                            
                            <h4>Conditional Statements:</h4>
                            <pre>
# If-elif-else
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Grade: {grade}")
                            </pre>
                            
                            <h4>Loops:</h4>
                            <pre>
# For loop
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Range-based for loop
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4

# While loop
count = 0
while count < 5:
    print(count)
    count += 1
                            </pre>
                        `
                    }
                ]
            },
            functions: {
                title: "Functions",
                resources: [
                    {
                        title: "Function Basics",
                        content: `
                            <h3>Function Basics</h3>
                            <p>Functions are defined using the <code>def</code> keyword:</p>
                            <pre>
def greet(name):
    """This function greets the person passed in as a parameter"""
    return f"Hello, {name}!"

# Function call
message = greet("Alice")
print(message)  # Output: Hello, Alice!
                            </pre>
                            
                            <h4>Parameters and Arguments:</h4>
                            <pre>
# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Bob"))           # Hello, Bob!
print(greet("Charlie", "Hi")) # Hi, Charlie!

# Keyword arguments
def describe_person(name, age, occupation):
    return f"{name} is {age} years old and works as a {occupation}."

print(describe_person(age=30, name="Dave", occupation="developer"))
                            </pre>
                            
                            <h4>Variable-length arguments:</h4>
                            <pre>
# *args for variable positional arguments
def sum_all(*numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs for variable keyword arguments
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=30, country="USA")
                            </pre>
                        `
                    },
                    {
                        title: "Lambda Functions",
                        content: `
                            <h3>Lambda Functions</h3>
                            <p>Lambda functions are small anonymous functions defined with the <code>lambda</code> keyword:</p>
                            <pre>
# Lambda function syntax
# lambda arguments: expression

# Simple lambda function
double = lambda x: x * 2
print(double(5))  # Output: 10

# Lambda with multiple arguments
add = lambda x, y: x + y
print(add(3, 4))  # Output: 7

# Lambda with conditional expression
is_even = lambda x: True if x % 2 == 0 else False
print(is_even(4))  # Output: True
print(is_even(5))  # Output: False
                            </pre>
                            
                            <h4>Using lambda with built-in functions:</h4>
                            <pre>
# With map()
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # Output: [1, 4, 9, 16, 25]

# With filter()
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # Output: [2, 4, 6, 8, 10]

# With sorted()
students = [
    {"name": "Alice", "grade": 85},
    {"name": "Bob", "grade": 92},
    {"name": "Charlie", "grade": 78}
]
sorted_students = sorted(students, key=lambda x: x["grade"], reverse=True)
for student in sorted_students:
    print(f"{student['name']}: {student['grade']}")
                            </pre>
                        `
                    }
                ]
            },
            oop: {
                title: "Object-Oriented Programming",
                resources: [
                    {
                        title: "Classes and Objects",
                        content: `
                            <h3>Classes and Objects</h3>
                            <p>Classes are defined using the <code>class</code> keyword:</p>
                            <pre>
class Person:
    """A simple class to represent a person"""
    
    # Class attribute (shared by all instances)
    species = "Human"
    
    # Constructor method
    def __init__(self, name, age):
        # Instance attributes (unique to each instance)
        self.name = name
        self.age = age
    
    # Instance method
    def introduce(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old."
    
    # Another instance method
    def celebrate_birthday(self):
        self.age += 1
        return f"Happy birthday! Now I'm {self.age} years old."

# Creating objects (instances)
alice = Person("Alice", 30)
bob = Person("Bob", 25)

# Accessing attributes
print(alice.name)  # Alice
print(bob.age)     # 25
print(Person.species)  # Human (class attribute)

# Calling methods
print(alice.introduce())  # Hi, I'm Alice and I'm 30 years old.
print(bob.celebrate_birthday())  # Happy birthday! Now I'm 26 years old.
                            </pre>
                        `
                    },
                    {
                        title: "Inheritance",
                        content: `
                            <h3>Inheritance</h3>
                            <p>Inheritance allows a class to inherit attributes and methods from another class:</p>
                            <pre>
# Parent (base) class
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
    
    def make_sound(self):
        return "Some generic animal sound"
    
    def info(self):
        return f"{self.name} is a {self.species}"

# Child (derived) class
class Dog(Animal):
    def __init__(self, name, breed):
        # Call parent class constructor
        super().__init__(name, "Dog")
        self.breed = breed
    
    # Override parent method
    def make_sound(self):
        return "Woof!"
    
    # New method in the child class
    def fetch(self):
        return f"{self.name} is fetching the ball!"

# Creating instances
generic_animal = Animal("Generic", "Unknown")
fido = Dog("Fido", "Golden Retriever")

# Using parent methods
print(generic_animal.info())  # Generic is a Unknown
print(fido.info())  # Fido is a Dog

# Overridden method
print(generic_animal.make_sound())  # Some generic animal sound
print(fido.make_sound())  # Woof!

# Child-specific method
print(fido.fetch())  # Fido is fetching the ball!
print(fido.breed)  # Golden Retriever
                            </pre>
                        `
                    }
                ]
            },
            datastructures: {
                title: "Data Structures",
                resources: [
                    {
                        title: "Lists",
                        content: `
                            <h3>Lists</h3>
                            <p>Lists are ordered, mutable collections of items:</p>
                            <pre>
# Creating a list
fruits = ["apple", "banana", "cherry"]

# Accessing items
print(fruits[0])  # apple
print(fruits[-1])  # cherry (negative indexing)

# Slicing
print(fruits[1:3])  # ['banana', 'cherry']

# Modifying items
fruits[1] = "blueberry"
print(fruits)  # ['apple', 'blueberry', 'cherry']

# Adding items
fruits.append("orange")  # Add to the end
fruits.insert(1, "kiwi")  # Insert at position 1
print(fruits)  # ['apple', 'kiwi', 'blueberry', 'cherry', 'orange']

# Removing items
fruits.remove("cherry")  # Remove by value
popped = fruits.pop()  # Remove and return the last item
del fruits[0]  # Delete by index
print(fruits)  # ['kiwi', 'blueberry']

# List methods
numbers = [3, 1, 4, 1, 5, 9, 2]
numbers.sort()  # Sort in place
print(numbers)  # [1, 1, 2, 3, 4, 5, 9]
print(len(numbers))  # 7 (number of items)
print(numbers.count(1))  # 2 (number of 1s)
numbers.reverse()  # Reverse in place
print(numbers)  # [9, 5, 4, 3, 2, 1, 1]
                            </pre>
                        `
                    },
                    {
                        title: "Dictionaries",
                        content: `
                            <h3>Dictionaries</h3>
                            <p>Dictionaries are collections of key-value pairs:</p>
                            <pre>
# Creating a dictionary
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York",
    "skills": ["Python", "JavaScript", "SQL"]
}

# Accessing values
print(person["name"])  # Alice
print(person.get("age"))  # 30
print(person.get("country", "Not specified"))  # Not specified (default value)

# Modifying dictionaries
person["age"] = 31  # Update value
person["country"] = "USA"  # Add new key-value pair
print(person)

# Removing items
removed_age = person.pop("age")  # Remove and return value
del person["city"]  # Delete key-value pair
print(person)

# Dictionary methods
keys = person.keys()  # Get all keys
values = person.values()  # Get all values
items = person.items()  # Get all key-value pairs as tuples
print(list(keys))
print(list(values))
print(list(items))

# Nested dictionaries
users = {
    "alice": {
        "age": 30,
        "email": "alice@example.com"
    },
    "bob": {
        "age": 25,
        "email": "bob@example.com"
    }
}
print(users["alice"]["email"])  # alice@example.com
                            </pre>
                        `
                    }
                ]
            },
            libraries: {
                title: "Python Libraries",
                resources: [
                    {
                        title: "NumPy Basics",
                        content: `
                            <h3>NumPy Basics</h3>
                            <p>NumPy is a powerful library for numerical computing in Python.</p>
                            <p><em>Note: NumPy is not available in this online environment, but here's how you would use it:</em></p>
                            <pre>
# Import NumPy
import numpy as np

# Creating arrays
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.zeros((3, 3))
arr3 = np.ones((2, 4))
arr4 = np.eye(3)  # 3x3 identity matrix
arr5 = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
arr6 = np.linspace(0, 1, 5)  # 5 evenly spaced values from 0 to 1

# Array operations
result1 = arr1 * 2  # Element-wise multiplication
result2 = arr1 + 5  # Element-wise addition

# Statistical functions
mean = np.mean(arr1)
median = np.median(arr1)
std_dev = np.std(arr1)
max_val = np.max(arr1)
min_val = np.min(arr1)

# Reshaping
arr7 = np.arange(10)
reshaped = arr7.reshape((2, 5))

# Boolean indexing
bool_idx = arr1 > 3
filtered = arr1[bool_idx]  # Contains only elements > 3
                            </pre>
                        `
                    },
                    {
                        title: "Matplotlib Basics",
                        content: `
                            <h3>Matplotlib Basics</h3>
                            <p>Matplotlib is a plotting library for creating static, animated, and interactive visualizations.</p>
                            <p><em>Note: Matplotlib is not available in this online environment, but here's how you would use it:</em></p>
                            <pre>
# Import Matplotlib
import matplotlib.pyplot as plt
import numpy as np

# Simple line plot
x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.figure(figsize=(8, 4))
plt.plot(x, y, label='sin(x)')
plt.title('Sine Wave')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.legend()
plt.grid(True)
plt.show()

# Multiple plots
x = np.linspace(0, 10, 100)
fig, ax = plt.subplots(2, 1, figsize=(8, 6))

# First subplot
ax[0].plot(x, np.sin(x), label='sin(x)')
ax[0].set_title('Sine Wave')
ax[0].legend()

# Second subplot
ax[1].plot(x, np.cos(x), 'r-', label='cos(x)')
ax[1].set_title('Cosine Wave')
ax[1].legend()

plt.tight_layout()
plt.show()

# Scatter plot
x = np.random.rand(50)
y = np.random.rand(50)
colors = np.random.rand(50)
sizes = 1000 * np.random.rand(50)

plt.scatter(x, y, c=colors, s=sizes, alpha=0.5)
plt.title('Scatter Plot')
plt.colorbar()
plt.show()
                            </pre>
                        `
                    }
                ]
            }
        };
    }
    
    /**
     * Show a specific resource category
     */
    showCategory(category) {
        if (!this.resources[category]) {
            console.error(`Category "${category}" not found`);
            return;
        }
        
        this.currentCategory = category;
        const categoryData = this.resources[category];
        
        // Create navigation for resources
        let navHTML = '<div class="resources-nav">';
        categoryData.resources.forEach((resource, index) => {
            navHTML += `<button class="resource-nav-item ${index === 0 ? 'active' : ''}" 
                            data-resource="${index}">${resource.title}</button>`;
        });
        navHTML += '</div>';
        
        // Create content container
        let contentHTML = '<div class="resources-content-container">';
        categoryData.resources.forEach((resource, index) => {
            contentHTML += `<div class="resource-content ${index === 0 ? 'active' : ''}" 
                                data-resource="${index}">${resource.content}</div>`;
        });
        contentHTML += '</div>';
        
        // Update panel
        const panel = document.getElementById('resourcesPanel');
        panel.querySelector('h2').textContent = categoryData.title;
        
        const contentEl = document.getElementById('resourcesContent');
        contentEl.innerHTML = navHTML + contentHTML;
        
        // Add event listeners to tabs
        contentEl.querySelectorAll('.resource-nav-item').forEach(tab => {
            tab.addEventListener('click', () => {
                const resourceId = tab.getAttribute('data-resource');
                this.activateResource(resourceId);
            });
        });
        
        // Show panel
        this.showPanel();
    }
    
    /**
     * Activate a specific resource within the current category
     */
    activateResource(resourceId) {
        const contentEl = document.getElementById('resourcesContent');
        
        // Deactivate all
        contentEl.querySelectorAll('.resource-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        contentEl.querySelectorAll('.resource-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activate selected
        contentEl.querySelector(`.resource-nav-item[data-resource="${resourceId}"]`).classList.add('active');
        contentEl.querySelector(`.resource-content[data-resource="${resourceId}"]`).classList.add('active');
    }
    
    /**
     * Show the resources panel
     */
    showPanel() {
        document.getElementById('resourcesPanel').classList.add('visible');
    }
    
    /**
     * Hide the resources panel
     */
    hidePanel() {
        document.getElementById('resourcesPanel').classList.remove('visible');
    }
}

// Initialize resources
const resourceManager = new ResourceManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    resourceManager.initialize();
    
    // Add help button functionality
    document.getElementById('helpButton').addEventListener('click', () => {
        resourceManager.showCategory('basics');
    });
});

// Export to window object
window.resourceManager = resourceManager;
