with open('admin.html', 'r') as f:
    content = f.read()

old = """        } else if(a.status === 'done'){
          actionBtns = '<button onclick=\"approveAndPay(\\''+String(a.id)+'\\')\" style=\"background:rgba(33,150,243,0.15);border:1px solid rgba(33,150,243,0.3);color:#2196f3;padding:0.3rem 0.75rem;border-radius:7px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit;\"><i class=\"fas fa-paper-plane\"></i> Approve &amp; Pay</button>';
        } else if(a.status === 'completed'){
          actionBtns = '<button onclick=\"releasePayment(\\''+String(a.id)+'\\')\" style=\"background:rgba(33,150,243,0.15);border:1px solid rgba(33,150,243,0.3);color:#2196f3;padding:0.3rem 0.75rem;border-radius:7px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:inherit;\"><i class=\"fas fa-paper-plane\"></i> Release Payment</button>';
        } else if(a.status === 'paid'){
          actionBtns = '<span style=\"font-size:0.72rem;color:#2196f3;font-weight:700;\"><i class=\"fas fa-check-double\"></i> Paid</span>';
        }"""

new = """        } else if(a.status === 'done'){
          actionBtns = '<span style=\"font-size:0.72rem;color:#9c27b0;font-weight:700;\"><i class=\"fas fa-flag-checkered\"></i> Marked Done</span>';
        } else if(a.status === 'completed' || a.status === 'paid'){
          actionBtns = '<span style=\"font-size:0.72rem;color:#2196f3;font-weight:700;\"><i class=\"fas fa-check-double\"></i> Paid</span>';
        }"""

if old in content:
    content = content.replace(old, new)
    with open('admin.html', 'w') as f:
        f.write(content)
    print('Done')
else:
    print('Not found')
    print(repr(content[415800:415900]))
