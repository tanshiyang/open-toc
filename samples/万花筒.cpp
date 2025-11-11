void cir(double a, int n) {
  t.speed(100);t.show();
  for (int j=0; j<n; j++) {
    t.fd(a);t.bk(a);t.rt(360.0/n);
  }
  t.oo(a/3);
}
int main() {
  t.hide();t.size(1);t.color(15);t.oo(1000);t.hide();
  for (int i=10; i<320; i++) {
    t.hide();t.speed(10);
    t.fd(i*0.5);t.rt(20);t.color(i%15);
    //.o(i*0.3,i%10);
    cir(i*0.3,i/2);
    t.wait(0.001);
  }
  t.hide();
  return 0;
}