

import os
import re
import requests
import frontmatter
import html
import time

# Your DEV.to API key
DEV_TO_API_KEY = '2YRiPjdFPePFZTmGnYx2x5G6'

def generate_canonical_url(file_path):
    directory_parts = os.path.dirname(file_path).split(os.sep)
    relevant_parts = [part for part in directory_parts if part != '.' and part != 'blog']
    file_name = os.path.splitext(os.path.basename(file_path))[0]
    canonical_url = f"https://www.sportstips.org/blog/{'/'.join(relevant_parts)}/{file_name}"
    return canonical_url

# Function to read and parse the markdown file
def read_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        post = frontmatter.load(file)
    return post

# Function to sanitize a string
def sanitize_string(string):
    # Remove non-alphanumeric characters and replace spaces with hyphens
    sanitized = re.sub(r'[^a-zA-Z0-9\s-]', '', string)
    sanitized = re.sub(r'\s+', ' ', sanitized)
    return sanitized

# Function to sanitize HTML content
def sanitize_html(content):
    # Escape HTML entities
    sanitized = html.escape(content)
    return sanitized

# Function to sanitize tags for DEV.to
def sanitize_tags(tags):
    sanitized_tags = []
    for tag in tags:
        # Remove non-alphanumeric characters and replace spaces with hyphens
        sanitized_tag = re.sub(r'[^a-zA-Z0-9\s-]', '', tag)
        sanitized_tag = re.sub(r'\s+', '', sanitized_tag)
        sanitized_tags.append(sanitized_tag)
    return sanitized_tags

# Function to publish an article to DEV.to
def publish_article_to_dev_to(post, file_path):
    headers = {
        'api-key': DEV_TO_API_KEY,
        'Content-Type': 'application/json'
    }
    
    # Sanitize tags
    tags = post.get('tags', [])
    tags = sanitize_tags(tags)
    tags = tags[:4]  # Use only the first 4 tags
    
    # Sanitize title
    title = sanitize_string(post['title'])
    
    # Sanitize content
    content = sanitize_html(post.content)
    
    # Generate canonical URL
    file_name = os.path.splitext(os.path.basename(file_path))[0]
    canonical_url = generate_canonical_url(file_path)
    cleanedurl = canonical_url.replace("./blog/", "")

        
    article_data = {
        'title': title,
        'published': not post.get('draft', True),
        'body_markdown': content,
        'tags': tags,
        'canonical_url': cleanedurl,
        'description': post.get('summary', ''),
        'main_image': post.get('images', [None])[0]
    }

    try:
        response = requests.post('https://dev.to/api/articles', headers=headers, json={'article': article_data}, timeout=10)
        
        if response.status_code == 201:
            print(f"Successfully published to DEV.to: {file_path}")
        elif response.status_code == 422 and "Canonical url has already been taken" in response.text:
            print(f"Skipping already published article: {file_path}")
        else:
            print(f"Failed to publish to DEV.to: {file_path}")
            print("Error:", response.content)
    except requests.exceptions.RequestException as e:
        print(f"Error occurred while publishing to DEV.to: {file_path}")
        print("Error:", str(e))

# Function to recursively process markdown files in a directory
def process_directory(directory):
    time.sleep(3)  # Sleep for 60 seconds to avoid violating rate limits
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                time.sleep(950)
                file_path = os.path.join(root, file)
                post = read_markdown_file(file_path)
                publish_article_to_dev_to(post, file_path)
                try:
                    time.sleep(6)  # Sleep for 60 seconds to avoid violating rate limits
                except KeyboardInterrupt:
                    print("Script interrupted by user. Exiting...")
                    return

# Main function to handle the process
def main():
    blog_directory = './blog/'
    process_directory(blog_directory)

if __name__ == '__main__':
    main()