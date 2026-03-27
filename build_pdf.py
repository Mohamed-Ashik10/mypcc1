import urllib.request
import urllib.parse
import uuid

url = 'https://texlive.net/cgi-bin/latexcgi'
with open('c:/Users/MOHAMED ASHIK/OneDrive/Desktop/Mohamed_Ashik_Resume.tex', 'r', encoding='utf-8') as f:
    text = f.read()

boundary = uuid.uuid4().hex

parts = []
def add_field(name, value):
    parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n')

add_field('filename[]', 'document.tex')
add_field('engine', 'pdflatex')
add_field('return', 'pdf')
add_field('filecontents[]', text)

body = ''.join(parts) + f'--{boundary}--\r\n'

req = urllib.request.Request(url, data=body.encode('utf-8'))
req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')

try:
    with urllib.request.urlopen(req) as r:
        content = r.read()
        if content.startswith(b'%PDF'):
            with open('c:/Users/MOHAMED ASHIK/OneDrive/Desktop/Mohamed_Ashik_Resume.pdf', 'wb') as f:
                f.write(content)
            print('Successfully generated PDF')
        else:
            print('Did not return PDF. Returned:', content[:100])
except Exception as e:
    print('Failed:', e)
