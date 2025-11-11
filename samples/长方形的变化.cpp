int main() {
  pen.color(5);pen.hide();
  for (int i = 0; i <= 400; i=i+40) {
    pen.r(400-i,i);
    pen.wait(0.01);
  }
  return 0;
}