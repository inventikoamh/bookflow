# Quick Replace Script
# Run these commands one by one to replace rose/pink with green

# Books Index
(Get-Content 'd:\BookFlow\resources\js\Pages\Books\Index.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Books\Index.jsx'

# Books Show  
(Get-Content 'd:\BookFlow\resources\js\Pages\Books\Show.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Books\Show.jsx'

# Books Create
(Get-Content 'd:\BookFlow\resources\js\Pages\Books\Create.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Books\Create.jsx'

# Books Edit
(Get-Content 'd:\BookFlow\resources\js\Pages\Books\Edit.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Books\Edit.jsx'

# Login
(Get-Content 'd:\BookFlow\resources\js\Pages\Auth\Login.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Auth\Login.jsx'

# Register
(Get-Content 'd:\BookFlow\resources\js\Pages\Auth\Register.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Auth\Register.jsx'

# Profile pages
(Get-Content 'd:\BookFlow\resources\js\Pages\Profile\Edit.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Profile\Edit.jsx'

(Get-Content 'd:\BookFlow\resources\js\Pages\Profile\Partials\UpdateProfileInformationForm.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Profile\Partials\UpdateProfileInformationForm.jsx'

(Get-Content 'd:\BookFlow\resources\js\Pages\Profile\Partials\UpdatePasswordForm.jsx') -replace 'rose-', 'green-' -replace 'pink-', 'green-' | Set-Content 'd:\BookFlow\resources\js\Pages\Profile\Partials\UpdatePasswordForm.jsx'
